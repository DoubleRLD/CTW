// Used for the 1-5 lifestyle scales (cleanliness, noise tolerance,
// social level) — a slider communicates "a scale between two
// opposites" much more clearly than a plain 1-5 dropdown, and shows
// the current value as a small badge rather than requiring a click
// to see what's selected.
function RangeSlider({ label, value, onChange, minLabel, maxLabel }) {
  return (
    <div className="range-field">
      <div className="range-field-header">
        <label>{label}</label>
        <span className="range-value-badge">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="range-end-labels">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default RangeSlider;
