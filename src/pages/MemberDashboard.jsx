import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppRoutines, saveAppRoutines } from '../data/mockData';
import { WeekSelector } from '../components/WeekSelector';
import { MemberDayCard } from '../components/MemberDayCard';
import './MemberDashboard.css';

export const MemberDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [myRoutines, setMyRoutines] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem('loggedUser'));
    if (!logged || logged.role !== 'member') {
      navigate('/');
    } else {
      setUserName(logged.name);
      setUserId(logged.id);
      setMyRoutines(getAppRoutines().filter((r) => r.userId === logged.id));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/');
  };

  const toggleExercise = (week, day, exerciseId) => {
    const allRoutines = getAppRoutines();

    const updatedLocal = myRoutines.map((r) => {
      if (r.week === week && r.day === day) {
        return {
          ...r,
          exercises: r.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          )
        };
      }
      return r;
    });
    setMyRoutines(updatedLocal);

    const updatedGlobal = allRoutines.map((r) => {
      if (r.userId === userId && r.week === week && r.day === day) {
        return {
          ...r,
          exercises: r.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          )
        };
      }
      return r;
    });
    saveAppRoutines(updatedGlobal);
  };

  const handleReportProgress = (e, week, day, exerciseId) => {
    e.stopPropagation();
    const actualWeight = prompt('¿Cuánto peso levantaste realmente? (kg):');
    if (!actualWeight || isNaN(actualWeight)) return;

    const parsedWeight = parseFloat(actualWeight);
    const allRoutines = getAppRoutines();

    const updatedLocal = myRoutines.map((r) => {
      if (r.week === week && r.day === day) {
        return {
          ...r,
          exercises: r.exercises.map((ex) =>
            ex.id === exerciseId
              ? { ...ex, actualWeight: parsedWeight, completed: true }
              : ex
          )
        };
      }
      return r;
    });
    setMyRoutines(updatedLocal);

    const updatedGlobal = allRoutines.map((r) => {
      if (r.userId === userId && r.week === week && r.day === day) {
        return {
          ...r,
          exercises: r.exercises.map((ex) =>
            ex.id === exerciseId
              ? { ...ex, actualWeight: parsedWeight, completed: true }
              : ex
          )
        };
      }
      return r;
    });
    saveAppRoutines(updatedGlobal);
  };

  const weekRoutines = myRoutines.filter((r) => r.week === selectedWeek);

  return (
    <div className="member-layout">
      <header className="member-header">
        <div>
          <h1>Mi Entrenamiento</h1>
          <p>
            ¡A romperla hoy, <strong>{userName}</strong>!
          </p>
        </div>
        <button onClick={handleLogout} className="logout-btn-member">
          Salir
        </button>
      </header>

      <WeekSelector
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
        prefix="Semana"
        variant="member"
      />

      <main>
        {weekRoutines.length > 0 ? (
          <div className="routine-grid">
            {weekRoutines.map((routine) => (
              <MemberDayCard
                key={`${routine.week}-${routine.day}`}
                routine={routine}
                onToggleExercise={toggleExercise}
                onReportProgress={handleReportProgress}
              />
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