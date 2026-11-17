import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppRoutines, saveAppRoutines } from '../data/mockData';
import './MemberDashboard.css';

export const MemberDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [myRoutines, setMyRoutines] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem('loggedUser'));
    if (!logged || logged.role !== 'member') navigate('/'); 
    else {
      setUserName(logged.name);
      setUserId(logged.id);
      setMyRoutines(getAppRoutines().filter(r => r.userId === logged.id));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/');
  };

  const toggleExercise = (week, day, exerciseId) => {
    const allRoutines = getAppRoutines();
    
    // Actualiza en memoria local para renderizado
    const updatedLocal = myRoutines.map(r => {
      if (r.week === week && r.day === day) {
        return { ...r, exercises: r.exercises.map(ex => ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex ) };
      }
      return r;
    });
    setMyRoutines(updatedLocal);

    // Guarda en localStorage global preservando rutinas de otros usuarios
    const updatedGlobal = allRoutines.map(r => {
      if (r.userId === userId && r.week === week && r.day === day) {
        return { ...r, exercises: r.exercises.map(ex => ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex ) };
      }
      return r;
    });
    saveAppRoutines(updatedGlobal);
  };

  const handleReportProgress = (e, week, day, exerciseId) => {
    e.stopPropagation();
    const actualWeight = prompt("¿Cuánto peso levantaste realmente? (kg):");
    if(!actualWeight || isNaN(actualWeight)) return;

    const allRoutines = getAppRoutines();

    const updatedLocal = myRoutines.map(r => {
      if (r.week === week && r.day === day) {
        return { ...r, exercises: r.exercises.map(ex => ex.id === exerciseId ? { ...ex, actualWeight: parseInt(actualWeight), completed: true } : ex ) };
      }
      return r;
    });
    setMyRoutines(updatedLocal);

    const updatedGlobal = allRoutines.map(r => {
      if (r.userId === userId && r.week === week && r.day === day) {
        return { ...r, exercises: r.exercises.map(ex => ex.id === exerciseId ? { ...ex, actualWeight: parseInt(actualWeight), completed: true } : ex ) };
      }
      return r;
    });
    saveAppRoutines(updatedGlobal);
  };

  return (
    <div className="member-layout">
      <header className="member-header">
        <div>
          <h1>Mi Entrenamiento</h1>
          <p>¡A romperla hoy, <strong>{userName}</strong>!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-member">Salir</button>
      </header>

      <div className="week-tabs">
        {[1,2,3,4].map(w => (
          <button key={w} className={`tab-btn ${selectedWeek === w ? 'active' : ''}`} onClick={() => setSelectedWeek(w)}>
            Semana {w}
          </button>
        ))}
      </div>

      <main>
        {myRoutines.filter(r => r.week === selectedWeek).length > 0 ? (
          <div className="routine-grid">
            {myRoutines.filter(r => r.week === selectedWeek).map((routine, index) => (
              <div key={index} className="day-card">
                <div className="day-header">{routine.day}</div>
                <ul className="exercise-list">
                  {routine.exercises.map(ex => (
                    <li key={ex.id} className={`exercise-item ${ex.completed ? 'completed' : ''}`} onClick={() => toggleExercise(routine.week, routine.day, ex.id)}>
                      <input type="checkbox" checked={ex.completed} readOnly className="checkbox-custom" />
                      <div className="exercise-details">
                        <span className="ex-name">{ex.name}</span>
                        <span className="ex-meta">{ex.sets} series de {ex.reps} reps | Objetivo: <strong>{ex.weight}kg</strong></span>
                        {ex.actualWeight && <span className="progress-text">Registrado: {ex.actualWeight}kg</span>}
                      </div>
                      <button className="btn-report" onClick={(e) => handleReportProgress(e, routine.week, routine.day, ex.id)}>
                        Modificar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-container">
            <h2>Semana libre.</h2>
            <p>Aún no tenés rutinas asignadas para la Semana {selectedWeek}.</p>
          </div>
        )}
      </main>
    </div>
  );
};