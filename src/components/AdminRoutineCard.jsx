import { calculateDayVolume } from '../data/mockData';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const AdminRoutineCard = ({ routine, onEditExercise, onDeleteExercise, onDuplicateDay }) => {
  const totalVolume = calculateDayVolume(routine.exercises);
  const otherDays = DAYS.filter((d) => d !== routine.day);

  return (
    <div className="routine-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
        <h4>
          {routine.day}{' '}
          <span className="progress-badge">
            {routine.exercises.length} {routine.exercises.length === 1 ? 'ejercicio' : 'ejercicios'} · {totalVolume} kg vol.
          </span>
        </h4>
        <select
          aria-label={`Duplicar ${routine.day} a otro día`}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onDuplicateDay(routine, e.target.value);
              e.target.value = '';
            }
          }}
          className="form-input"
          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
        >
          <option value="" disabled>
            Duplicar día a...
          </option>
          {otherDays.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        {routine.exercises.map((ex) => (
          <div key={ex.id} className="routine-item">
            <div className="routine-item-info">
              <strong>{ex.name}</strong> <br />
              {ex.sets}x{ex.reps} | {ex.weight}kg
              {ex.actualWeight && (
                <span className="progress-badge">Registrado: {ex.actualWeight}kg</span>
              )}
            </div>
            <div className="actions">
              <button
                type="button"
                onClick={() => onEditExercise(routine, ex)}
                className="btn-edit"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => onDeleteExercise(routine, ex.id)}
                className="btn-del"
              >
                ✗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};