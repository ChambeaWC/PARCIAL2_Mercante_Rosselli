import { calculateDayVolume } from '../data/mockData';

export const MemberDayCard = ({ routine, onToggleExercise, onReportProgress }) => {
  const completedCount = routine.exercises.filter((ex) => ex.completed).length;
  const totalCount = routine.exercises.length;
  const dayVolume = calculateDayVolume(routine.exercises);

  return (
    <div className="day-card">
      <div className="day-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{routine.day}</span>
        <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
          {completedCount}/{totalCount} hechos · {dayVolume} kg
        </span>
      </div>

      <ul className="exercise-list">
        {routine.exercises.map((ex) => (
          <li
            key={ex.id}
            className={`exercise-item ${ex.completed ? 'completed' : ''}`}
            onClick={() => onToggleExercise(routine.week, routine.day, ex.id)}
          >
            <input
              type="checkbox"
              checked={ex.completed}
              readOnly
              className="checkbox-custom"
            />
            <div className="exercise-details">
              <span className="ex-name">{ex.name}</span>
              <span className="ex-meta">
                {ex.sets} series de {ex.reps} reps | Objetivo: <strong>{ex.weight}kg</strong>
              </span>
              {ex.actualWeight && (
                <span className="progress-text">Registrado: {ex.actualWeight}kg</span>
              )}
            </div>
            <button
              type="button"
              className="btn-report"
              onClick={(e) => onReportProgress(e, routine.week, routine.day, ex.id)}
            >
              Modificar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};