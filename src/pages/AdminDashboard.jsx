import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAppUsers,
  saveAppUsers,
  getAppRoutines,
  saveAppRoutines,
  getAppCatalog,
  saveAppCatalog
} from '../data/mockData';
import { AdminSidebar } from '../components/AdminSidebar';
import { ExerciseAssignmentForm } from '../components/ExerciseAssignmentForm';
import { WeekSelector } from '../components/WeekSelector';
import { AdminRoutineCard } from '../components/AdminRoutineCard';
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

  // Sobrecarga Progresiva
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
      setMembers(getAppUsers().filter((u) => u.role === 'member'));
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
      role: 'member',
      name: newMemberName
    };
    const updatedUsers = [...currentUsers, newUser];
    saveAppUsers(updatedUsers);
    setMembers(updatedUsers.filter((u) => u.role === 'member'));
    setNewMemberName('');
    setNewMemberUser('');
    setNewMemberPassword('');
  };

  const handleCreateToCatalog = (e) => {
    e.preventDefault();
    const trimmed = newCatalogExName.trim();
    if (!trimmed) return;
    const newEx = { id: Date.now(), name: trimmed };
    const updatedCatalog = [...catalog, newEx];
    setCatalog(updatedCatalog);
    saveAppCatalog(updatedCatalog);
    setNewCatalogExName('');
  };

  const resetForm = () => {
    setSelectedExId('');
    setNewSets('');
    setNewReps('');
    setNewWeight('');
    setEditingEx(null);
    setAutoProgress(false);
    setProgReps(0);
    setProgWeight(0);
    setProgWeightType('kg');
  };

  const handleSaveExercise = (e) => {
    e.preventDefault();
    if (!selectedMember || !selectedExId) return;

    const catalogIdNum = parseInt(selectedExId, 10);
    const exerciseDetails = catalog.find((ex) => ex.id === catalogIdNum);
    if (!exerciseDetails) return;

    let updatedRoutines = [...routinesState];
    const baseSets = parseInt(newSets, 10) || 0;
    const baseReps = parseInt(newReps, 10) || 0;
    const baseWeight = parseFloat(newWeight) || 0;

    if (editingEx) {
      updatedRoutines = updatedRoutines.map((r) => {
        if (r.week === editTargetWeek && r.day === newDay && r.userId === selectedMember.id) {
          return {
            ...r,
            exercises: r.exercises.map((ex) =>
              ex.id === editingEx.id
                ? {
                    ...ex,
                    catalogId: exerciseDetails.id,
                    name: exerciseDetails.name,
                    sets: baseSets,
                    reps: baseReps,
                    weight: baseWeight
                  }
                : ex
            )
          };
        }
        return r;
      });
      setEditingEx(null);
    } else if (assignMode === 'single') {
      const newExForRoutine = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        catalogId: exerciseDetails.id,
        name: exerciseDetails.name,
        sets: baseSets,
        reps: baseReps,
        weight: baseWeight,
        completed: false,
        actualWeight: null
      };
      const dayIndex = updatedRoutines.findIndex(
        (r) => r.userId === selectedMember.id && r.week === targetWeek && r.day === newDay
      );

      if (dayIndex >= 0) {
        updatedRoutines[dayIndex] = {
          ...updatedRoutines[dayIndex],
          exercises: [...updatedRoutines[dayIndex].exercises, newExForRoutine]
        };
      } else {
        updatedRoutines.push({
          userId: selectedMember.id,
          week: targetWeek,
          day: newDay,
          exercises: [newExForRoutine]
        });
      }
      setSelectedWeekFilter(targetWeek);
    } else {
      const incReps = parseInt(progReps, 10) || 0;
      const incWeight = parseFloat(progWeight) || 0;

      [1, 2, 3, 4].forEach((w, index) => {
        const calcReps = autoProgress ? baseReps + incReps * index : baseReps;
        let calcWeight = baseWeight;

        if (autoProgress && incWeight > 0) {
          if (progWeightType === 'kg') {
            calcWeight = baseWeight + incWeight * index;
          } else if (progWeightType === '%') {
            const exactWeight = baseWeight + baseWeight * (incWeight / 100) * index;
            calcWeight = Math.round(exactWeight * 2) / 2;
          }
        }

        const newExForRoutine = {
          id: Date.now() + w + Math.floor(Math.random() * 1000),
          catalogId: exerciseDetails.id,
          name: exerciseDetails.name,
          sets: baseSets,
          reps: calcReps,
          weight: calcWeight,
          completed: false,
          actualWeight: null
        };

        const dayIndex = updatedRoutines.findIndex(
          (r) => r.userId === selectedMember.id && r.week === w && r.day === newDay
        );

        if (dayIndex >= 0) {
          updatedRoutines[dayIndex] = {
            ...updatedRoutines[dayIndex],
            exercises: [...updatedRoutines[dayIndex].exercises, newExForRoutine]
          };
        } else {
          updatedRoutines.push({
            userId: selectedMember.id,
            week: w,
            day: newDay,
            exercises: [newExForRoutine]
          });
        }
      });
    }

    setRoutinesState(updatedRoutines);
    saveAppRoutines(updatedRoutines);
    resetForm();
  };

  const loadExerciseToEdit = (routine, ex) => {
    setEditTargetWeek(routine.week);
    setNewDay(routine.day);
    const catalogEx = catalog.find((c) => c.id === ex.catalogId || c.name === ex.name);
    setSelectedExId(catalogEx ? String(catalogEx.id) : '');
    setNewSets(ex.sets);
    setNewReps(ex.reps);
    setNewWeight(ex.weight);
    setEditingEx(ex);
  };

  const handleDeleteExercise = (routine, exId) => {
    if (!window.confirm('¿Borrar este ejercicio?')) return;
    const updated = routinesState.map((r) => {
      if (r === routine) {
        return { ...r, exercises: r.exercises.filter((ex) => ex.id !== exId) };
      }
      return r;
    });
    const cleaned = updated.filter((r) => r.exercises.length > 0);
    setRoutinesState(cleaned);
    saveAppRoutines(cleaned);
  };

  const handleDuplicateDay = (sourceRoutine, destinationDay) => {
    const clonedExercises = sourceRoutine.exercises.map((ex, idx) => ({
      ...ex,
      id: Date.now() + idx + Math.floor(Math.random() * 1000),
      completed: false,
      actualWeight: null
    }));

    const updated = [...routinesState];
    const destIndex = updated.findIndex(
      (r) =>
        r.userId === sourceRoutine.userId &&
        r.week === sourceRoutine.week &&
        r.day === destinationDay
    );

    if (destIndex >= 0) {
      updated[destIndex] = {
        ...updated[destIndex],
        exercises: [...updated[destIndex].exercises, ...clonedExercises]
      };
    } else {
      updated.push({
        userId: sourceRoutine.userId,
        week: sourceRoutine.week,
        day: destinationDay,
        exercises: clonedExercises
      });
    }

    setRoutinesState(updated);
    saveAppRoutines(updated);
  };

  const dayRoutines = routinesState.filter(
    (r) => selectedMember && r.userId === selectedMember.id && r.week === selectedWeekFilter
  );

  return (
    <div className="admin-layout">
      <AdminSidebar
        adminName={adminName}
        members={members}
        searchMember={searchMember}
        onSearchChange={setSearchMember}
        selectedMember={selectedMember}
        onSelectMember={(member) => {
          setSelectedMember(member);
          resetForm();
        }}
        newMemberName={newMemberName}
        onNewMemberNameChange={setNewMemberName}
        newMemberUser={newMemberUser}
        onNewMemberUserChange={setNewMemberUser}
        newMemberPassword={newMemberPassword}
        onNewMemberPasswordChange={setNewMemberPassword}
        onCreateMember={handleCreateMember}
        onLogout={handleLogout}
      />

      <main className="admin-content">
        <h4 className="sidebar-section-title">Catálogo Global de Ejercicios</h4>
        <form onSubmit={handleCreateToCatalog} className="catalog-form">
          <input
            type="text"
            placeholder="Ej: Peso Muerto"
            value={newCatalogExName}
            onChange={(e) => setNewCatalogExName(e.target.value)}
            required
            className="form-input"
          />
          <button type="submit" className="btn-primary">
            + Agregar al Catálogo
          </button>
        </form>
        <hr className="divider" />

        {selectedMember ? (
          <>
            <h2 className="section-header">Panel de Entrenamiento: {selectedMember.name}</h2>

            <ExerciseAssignmentForm
              catalog={catalog}
              editingEx={editingEx}
              editTargetWeek={editTargetWeek}
              assignMode={assignMode}
              onAssignModeChange={setAssignMode}
              targetWeek={targetWeek}
              onTargetWeekChange={setTargetWeek}
              newDay={newDay}
              onNewDayChange={setNewDay}
              selectedExId={selectedExId}
              onSelectedExIdChange={setSelectedExId}
              newSets={newSets}
              onNewSetsChange={setNewSets}
              newReps={newReps}
              onNewRepsChange={setNewReps}
              newWeight={newWeight}
              onNewWeightChange={setNewWeight}
              autoProgress={autoProgress}
              onAutoProgressChange={setAutoProgress}
              progReps={progReps}
              onProgRepsChange={setProgReps}
              progWeight={progWeight}
              onProgWeightChange={setProgWeight}
              progWeightType={progWeightType}
              onProgWeightTypeChange={setProgWeightType}
              onSubmit={handleSaveExercise}
              onCancelEdit={resetForm}
            />

            <WeekSelector
              selectedWeek={selectedWeekFilter}
              onSelectWeek={setSelectedWeekFilter}
              prefix="Visualizar Semana"
              variant="admin"
            />

            <div className="routine-grid">
              {dayRoutines.map((rutina) => (
                <AdminRoutineCard
                  key={`${rutina.week}-${rutina.day}`}
                  routine={rutina}
                  onEditExercise={loadExerciseToEdit}
                  onDeleteExercise={handleDeleteExercise}
                  onDuplicateDay={handleDuplicateDay}
                />
              ))}
              {dayRoutines.length === 0 && (
                <p className="empty-state">
                  No hay rutina cargada para la Semana {selectedWeekFilter}.
                </p>
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