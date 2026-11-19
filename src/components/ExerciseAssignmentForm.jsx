const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ExerciseAssignmentForm = ({
  catalog,
  editingEx,
  editTargetWeek,
  assignMode,
  onAssignModeChange,
  targetWeek,
  onTargetWeekChange,
  newDay,
  onNewDayChange,
  selectedExId,
  onSelectedExIdChange,
  newSets,
  onNewSetsChange,
  newReps,
  onNewRepsChange,
  newWeight,
  onNewWeightChange,
  autoProgress,
  onAutoProgressChange,
  progReps,
  onProgRepsChange,
  progWeight,
  onProgWeightChange,
  progWeightType,
  onProgWeightTypeChange,
  onSubmit,
  onCancelEdit
}) => {
  return (
    <form className="exercise-form" onSubmit={onSubmit}>
      {editingEx && (
        <div className="form-group">
          <label>Editando</label>
          <div className="edit-badge">Semana {editTargetWeek}</div>
        </div>
      )}

      {!editingEx && (
        <div className="form-group">
          <label>Modo de Asignación</label>
          <select
            value={assignMode}
            onChange={(e) => onAssignModeChange(e.target.value)}
            className="form-input"
          >
            <option value="all">A las 4 Semanas</option>
            <option value="single">Semana Específica</option>
          </select>
        </div>
      )}

      {!editingEx && assignMode === 'single' && (
        <div className="form-group">
          <label>¿Cuál Semana?</label>
          <select
            value={targetWeek}
            onChange={(e) => onTargetWeekChange(parseInt(e.target.value, 10))}
            className="form-input"
          >
            {[1, 2, 3, 4].map((w) => (
              <option key={w} value={w}>
                Semana {w}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Día</label>
        <select
          value={newDay}
          onChange={(e) => onNewDayChange(e.target.value)}
          className="form-input"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Ejercicio</label>
        <select
          value={selectedExId}
          onChange={(e) => onSelectedExIdChange(e.target.value)}
          required
          className="form-input"
        >
          <option value="" disabled>
            Seleccionar...
          </option>
          {catalog.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Series</label>
        <input
          type="number"
          min="1"
          value={newSets}
          onChange={(e) => onNewSetsChange(e.target.value)}
          required
          className="form-input input-small"
        />
      </div>

      <div className="form-group">
        <label>Reps base</label>
        <input
          type="number"
          min="1"
          value={newReps}
          onChange={(e) => onNewRepsChange(e.target.value)}
          required
          className="form-input input-small"
        />
      </div>

      <div className="form-group">
        <label>Peso base (kg)</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={newWeight}
          onChange={(e) => onNewWeightChange(e.target.value)}
          required
          className="form-input input-medium"
        />
      </div>

      {!editingEx && assignMode === 'all' && (
        <div className="automation-box">
          <label className="automation-header">
            <input
              type="checkbox"
              checked={autoProgress}
              onChange={(e) => onAutoProgressChange(e.target.checked)}
            />
            Aplicar Sobrecarga Progresiva Automática
          </label>
          {autoProgress && (
            <div className="progression-inputs">
              <div className="prog-group">
                <span>Aumentar</span>
                <input
                  type="number"
                  step="1"
                  value={progReps}
                  onChange={(e) => onProgRepsChange(e.target.value)}
                  placeholder="0"
                  className="input-prog"
                />
                <span>Reps / sem</span>
              </div>
              <div className="prog-group">
                <span>Aumentar</span>
                <input
                  type="number"
                  step="0.5"
                  value={progWeight}
                  onChange={(e) => onProgWeightChange(e.target.value)}
                  placeholder="0"
                  className="input-prog"
                />
                <select
                  value={progWeightType}
                  onChange={(e) => onProgWeightTypeChange(e.target.value)}
                  className="form-input"
                  style={{ padding: '6px', height: 'auto' }}
                >
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
          {editingEx ? 'Guardar Cambios' : `Agregar a ${newDay}`}
        </button>
        {editingEx && (
          <button type="button" onClick={onCancelEdit} className="btn-secondary">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};