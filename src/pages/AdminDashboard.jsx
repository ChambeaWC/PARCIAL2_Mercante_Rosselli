import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppUsers, saveAppUsers, getAppRoutines, saveAppRoutines, getAppCatalog, saveAppCatalog } from '../data/mockData';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [adminName, setAdminName] = useState('');
  const [members, setMembers] = useState([]);
  const [searchMember, setSearchMember] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [routinesState, setRoutinesState] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState(1);

  const [assignMode, setAssignMode] = useState('all'); 
  const [targetWeek, setTargetWeek] = useState(1);
  const [newDay, setNewDay] = useState('Lunes');
  const [selectedExId, setSelectedExId] = useState('');
  const [newSets, setNewSets] = useState('');
  const [newReps, setNewReps] = useState('');
  const [newWeight, setNewWeight] = useState('');
  
  // Estados para Sobrecarga Progresiva
  const [autoProgress, setAutoProgress] = useState(false);
  const [progReps, setProgReps] = useState(0);
  const [progWeight, setProgWeight] = useState(0);
  const [progWeightType, setProgWeightType] = useState('kg');

  const [editingEx, setEditingEx] = useState(null);
  const [editTargetWeek, setEditTargetWeek] = useState(1);
  const [newCatalogExName, setNewCatalogExName] = useState('');

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUser, setNewMemberUser] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');

  useEffect(() => {
    const loggedStr = localStorage.getItem('loggedUser');
    if (!loggedStr) {
      navigate('/');
      return;
    }
    const logged = JSON.parse(loggedStr);
    if (logged.role !== 'trainer') {
      navigate('/'); 
    } else {
      setAdminName(logged.name);
      setMembers(getAppUsers().filter(u => u.role === 'member'));
      setRoutinesState(getAppRoutines());
      setCatalog(getAppCatalog());
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/');
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    const currentUsers = getAppUsers();
    const newUser = {
      id: Date.now(),
      username: newMemberUser,
      password: newMemberPassword,
      role: "member",
      name: newMemberName
    };
    const updatedUsers = [...currentUsers, newUser];
    saveAppUsers(updatedUsers);
    setMembers(updatedUsers.filter(u => u.role === 'member'));
    setNewMemberName('');
    setNewMemberUser('');
    setNewMemberPassword('');
  };

  const handleCreateToCatalog = (e) => {
    e.preventDefault();
    const newEx = { id: Date.now(), name: newCatalogExName };
    const updatedCatalog = [...catalog, newEx];
    setCatalog(updatedCatalog);
    saveAppCatalog(updatedCatalog);
    setNewCatalogExName('');
  };

  const handleSaveExercise = (e) => {
    e.preventDefault();
    if (!selectedMember || !selectedExId) return;

    const exerciseDetails = catalog.find(ex => ex.id === parseInt(selectedExId));
    let updatedRoutines = [...routinesState];

    const baseSets = parseInt(newSets) || 0;
    const baseReps = parseInt(newReps) || 0;
    const baseWeight = parseFloat(newWeight) || 0;

    if (editingEx) {
      updatedRoutines = updatedRoutines.map(r => {
        if (r.week === editTargetWeek && r.day === newDay && r.userId === selectedMember.id) {
          return {
            ...r,
            exercises: r.exercises.map(ex => ex.id === editingEx.id 
              ? { ...ex, id: parseInt(selectedExId), name: exerciseDetails.name, sets: baseSets, reps: baseReps, weight: baseWeight } 
              : ex)
          };
        }
        return r;
      });
      setEditingEx(null);
    } else {
      if (assignMode === 'single') {
        const newExForRoutine = { id: Date.now(), name: exerciseDetails.name, sets: baseSets, reps: baseReps, weight: baseWeight, completed: false, actualWeight: null };
        const dayIndex = updatedRoutines.findIndex(r => r.userId === selectedMember.id && r.week === targetWeek && r.day === newDay);
        
        if (dayIndex >= 0) updatedRoutines[dayIndex].exercises.push(newExForRoutine);
        else updatedRoutines.push({ userId: selectedMember.id, week: targetWeek, day: newDay, exercises: [newExForRoutine] });
      
      } else {
        const incReps = parseInt(progReps) || 0;
        const incWeight = parseFloat(progWeight) || 0;

        [1, 2, 3, 4].forEach((w, index) => {
          const calcReps = autoProgress ? baseReps + (incReps * index) : baseReps;
          
          let calcWeight = baseWeight;
          if (autoProgress && incWeight > 0) {
            if (progWeightType === 'kg') {
              calcWeight = baseWeight + (incWeight * index);
            } else if (progWeightType === '%') {
              // Aplica el porcentaje y redondea al múltiplo de 0.5kg más cercano para discos de gimnasio reales
              const exactWeight = baseWeight + (baseWeight * (incWeight / 100) * index);
              calcWeight = Math.round(exactWeight * 2) / 2; 
            }
          }

          const newExForRoutine = { id: Date.now() + w, name: exerciseDetails.name, sets: baseSets, reps: calcReps, weight: calcWeight, completed: false, actualWeight: null };
          const dayIndex = updatedRoutines.findIndex(r => r.userId === selectedMember.id && r.week === w && r.day === newDay);
          
          if (dayIndex >= 0) updatedRoutines[dayIndex].exercises.push(newExForRoutine);
          else updatedRoutines.push({ userId: selectedMember.id, week: w, day: newDay, exercises: [newExForRoutine] });
        });
      }
    }

    setRoutinesState(updatedRoutines);
    saveAppRoutines(updatedRoutines);
    resetForm();
  };

  const resetForm = () => {
    setSelectedExId(''); setNewSets(''); setNewReps(''); setNewWeight(''); 
    setEditingEx(null); setAutoProgress(false); setProgReps(0); setProgWeight(0); setProgWeightType('kg');
  };

  const loadExerciseToEdit = (routine, ex) => {
    setEditTargetWeek(routine.week);
    setNewDay(routine.day);
    const catalogEx = catalog.find(c => c.name === ex.name);
    setSelectedExId(catalogEx ? catalogEx.id : '');
    setNewSets(ex.sets); setNewReps(ex.reps); setNewWeight(ex.weight);
    setEditingEx(ex);
  };

  const handleDeleteExercise = (routine, exId) => {
    if(!window.confirm("¿Borrar este ejercicio?")) return;
    const updated = routinesState.map(r => {
      if (r === routine) return { ...r, exercises: r.exercises.filter(ex => ex.id !== exId) };
      return r;
    });
    const cleaned = updated.filter(r => r.exercises.length > 0);
    setRoutinesState(cleaned);
    saveAppRoutines(cleaned);
  };

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchMember.toLowerCase()));

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>IronTrack</h3>
        <p className="trainer-greeting">Hola, <strong>{adminName}</strong></p>
        
        <h4 className="sidebar-section-title">Nuevo Socio</h4>
        <form onSubmit={handleCreateMember} className="add-member-form">
          <input type="text" placeholder="Nombre completo" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} required className="add-member-input" />
          <input type="text" placeholder="Usuario login" value={newMemberUser} onChange={(e) => setNewMemberUser(e.target.value)} required className="add-member-input" />
          <input type="password" placeholder="Contraseña" value={newMemberPassword} onChange={(e) => setNewMemberPassword(e.target.value)} required className="add-member-input" />
          <button type="submit" className="btn-primary">Crear</button>
        </form>

        <h4 className="sidebar-section-title">Buscar Socio</h4>
        <input type="text" placeholder="Buscar..." value={searchMember} onChange={(e) => setSearchMember(e.target.value)} className="search-input" />

        <ul className="member-list">
          {filteredMembers.map(member => (
             <li key={member.id} className={`member-item ${selectedMember?.id === member.id ? 'active' : ''}`} onClick={() => {setSelectedMember(member); resetForm();}}>
               {member.name}
             </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
      </aside>

      <main className="admin-content">
        <h4 className="sidebar-section-title">Catálogo Global de Ejercicios</h4>
        <form onSubmit={handleCreateToCatalog} className="catalog-form">
          <input type="text" placeholder="Ej: Peso Muerto" value={newCatalogExName} onChange={(e) => setNewCatalogExName(e.target.value)} required className="form-input" />
          <button type="submit" className="btn-primary">+ Agregar al Catálogo</button>
        </form>
        <hr className="divider" />

        {selectedMember ? (
          <>
            <h2 className="section-header">Panel de Entrenamiento: {selectedMember.name}</h2>
            
            <form className="exercise-form" onSubmit={handleSaveExercise}>
              {editingEx && (
                <div className="form-group">
                  <label>Editando</label>
                  <div className="edit-badge">Semana {editTargetWeek}</div>
                </div>
              )}

              {!editingEx && (
                <div className="form-group">
                  <label>Modo de Asignación</label>
                  <select value={assignMode} onChange={(e) => setAssignMode(e.target.value)} className="form-input">
                    <option value="all">A las 4 Semanas</option>
                    <option value="single">Semana Específica</option>
                  </select>
                </div>
              )}

              {!editingEx && assignMode === 'single' && (
                <div className="form-group">
                  <label>¿Cuál Semana?</label>
                  <select value={targetWeek} onChange={(e) => setTargetWeek(parseInt(e.target.value))} className="form-input">
                    {[1,2,3,4].map(w => <option key={w} value={w}>Semana {w}</option>)}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Día</label>
                <select value={newDay} onChange={(e) => setNewDay(e.target.value)} className="form-input">
                  {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Ejercicio</label>
                <select value={selectedExId} onChange={(e) => setSelectedExId(e.target.value)} required className="form-input">
                  <option value="" disabled>Seleccionar...</option>
                  {catalog.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Series</label>
                <input type="number" min="1" value={newSets} onChange={(e) => setNewSets(e.target.value)} required className="form-input input-small" />
              </div>
              <div className="form-group">
                <label>Reps base</label>
                <input type="number" min="1" value={newReps} onChange={(e) => setNewReps(e.target.value)} required className="form-input input-small" />
              </div>
              <div className="form-group">
                <label>Peso base (kg)</label>
                <input type="number" min="0" step="0.5" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} required className="form-input input-medium" />
              </div>

              {!editingEx && assignMode === 'all' && (
                <div className="automation-box">
                  <label className="automation-header">
                    <input type="checkbox" checked={autoProgress} onChange={(e) => setAutoProgress(e.target.checked)} />
                    Aplicar Sobrecarga Progresiva Automática
                  </label>
                  {autoProgress && (
                    <div className="progression-inputs">
                      <div className="prog-group">
                        <span>Aumentar</span>
                        <input type="number" step="1" value={progReps} onChange={(e) => setProgReps(e.target.value)} placeholder="0" className="input-prog" />
                        <span>Reps / sem</span>
                      </div>
                      <div className="prog-group">
                        <span>Aumentar</span>
                        <input type="number" step="0.5" value={progWeight} onChange={(e) => setProgWeight(e.target.value)} placeholder="0" className="input-prog" />
                        <select value={progWeightType} onChange={(e) => setProgWeightType(e.target.value)} className="form-input" style={{padding: '6px', height: 'auto'}}>
                          <option value="kg">Kg / sem</option>
                          <option value="%">% / sem</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ width: '100%', display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary">
                  {editingEx ? 'Guardar Cambios' : 'Asignar Ejercicio'}
                </button>
                {editingEx && <button type="button" onClick={resetForm} className="btn-secondary">Cancelar</button>}
              </div>
            </form>

            <div className="week-selector">
              {[1,2,3,4].map(w => (
                <button key={w} className={`week-btn ${selectedWeekFilter === w ? 'active' : ''}`} onClick={() => setSelectedWeekFilter(w)}>
                  Visualizar Semana {w}
                </button>
              ))}
            </div>

            <div className="routine-grid">
              {routinesState.filter(r => r.userId === selectedMember.id && r.week === selectedWeekFilter).map((rutina, index) => (
                  <div key={index} className="routine-card">
                    <h4>{rutina.day}</h4>
                    <div>
                      {rutina.exercises.map(ex => (
                        <div key={ex.id} className="routine-item">
                          <div className="routine-item-info">
                            <strong>{ex.name}</strong> <br/>
                            {ex.sets}x{ex.reps} | {ex.weight}kg
                            {ex.actualWeight && <span className="progress-badge">Registrado: {ex.actualWeight}kg</span>}
                          </div>
                          <div className="actions">
                            <button onClick={() => loadExerciseToEdit(rutina, ex)} className="btn-edit">✎</button>
                            <button onClick={() => handleDeleteExercise(rutina, ex.id)} className="btn-del">✗</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              ))}
              {routinesState.filter(r => r.userId === selectedMember.id && r.week === selectedWeekFilter).length === 0 && (
                <p className="empty-state">No hay rutina cargada para la Semana {selectedWeekFilter}.</p>
              )}
            </div>
          </>
        ) : (
          <h2 className="section-header">Seleccioná un socio en el menú lateral.</h2>
        )}
      </main>
    </div>
  );
};