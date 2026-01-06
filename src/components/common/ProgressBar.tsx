interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ current, target, label, showPercentage = true }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const exceeded = current > target;
  const remaining = target - current;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {label && (
        <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      )}

      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
            exceeded ? 'bg-green-500' : 'bg-[#0d9488]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${exceeded ? 'text-green-600' : 'text-gray-900'}`}>
          {exceeded ? (
            <>Great month! You've exceeded target by {Math.round(percentage - 100)}%</>
          ) : (
            <>You're <span className="font-semibold">{formatCurrency(remaining)}</span> away from your monthly target of {formatCurrency(target)}</>
          )}
        </p>
        {showPercentage && (
          <span className={`text-sm font-semibold tabular-nums ${exceeded ? 'text-green-600' : 'text-gray-600'}`}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
}
