interface ProgressBarProps {
  pct: number;
  color: string;
  className?: string;
}

export function ProgressBar({ pct, color, className }: ProgressBarProps) {
  return (
    <div className={`overflow-hidden rounded-pill bg-white/10 ${className ?? "h-2"}`}>
      <div
        className="h-full rounded-pill"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }}
      />
    </div>
  );
}
