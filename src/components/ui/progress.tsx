export function Progress({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label?: string;
}) {
  const percent = Math.max(0, Math.min(100, Math.round((value / (max || 1)) * 100)));
  return (
    <div className="grid gap-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>{label}</span>
          <span className="muted">{percent}%</span>
        </div>
      )}
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <div style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
