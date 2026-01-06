interface ScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({ score, showLabel = true, size = 'md' }: ScoreBadgeProps) {
  const getColorClasses = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border tabular-nums ${getColorClasses(score)} ${sizeClasses[size]}`}>
      {score}
      {showLabel && <span className="font-normal text-xs">/100</span>}
    </span>
  );
}
