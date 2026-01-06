import type { LoadStatus, CommissionRunStatus } from '../../types';

interface StatusPillProps {
  status: LoadStatus | CommissionRunStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  Paid: 'bg-green-100 text-green-800 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Partial: 'bg-orange-100 text-orange-800 border-orange-200',
  Overdue: 'bg-red-100 text-red-800 border-red-200',
  Disputed: 'bg-purple-100 text-purple-800 border-purple-200',
  Draft: 'bg-gray-100 text-gray-800 border-gray-200',
  Finalized: 'bg-green-100 text-green-800 border-green-200',
};

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${statusStyles[status]} ${sizeClasses}`}>
      {status}
    </span>
  );
}
