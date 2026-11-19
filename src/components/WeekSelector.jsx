export const WeekSelector = ({ weeks = [1, 2, 3, 4], selectedWeek, onSelectWeek, prefix = 'Semana', variant = 'admin' }) => {
  const containerClass = variant === 'member' ? 'week-tabs' : 'week-selector';
  const btnClass = variant === 'member' ? 'tab-btn' : 'week-btn';

  return (
    <div className={containerClass}>
      {weeks.map((week) => (
        <button
          key={week}
          type="button"
          className={`${btnClass} ${selectedWeek === week ? 'active' : ''}`}
          onClick={() => onSelectWeek(week)}
        >
          {prefix} {week}
        </button>
      ))}
    </div>
  );
};