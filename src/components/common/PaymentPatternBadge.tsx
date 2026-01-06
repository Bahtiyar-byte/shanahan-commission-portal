import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { PaymentPattern } from '../../types';

interface PaymentPatternBadgeProps {
  pattern: PaymentPattern;
}

const patternConfig: Record<PaymentPattern, { icon: typeof Clock; colorClasses: string; label: string }> = {
  'On Time': {
    icon: CheckCircle,
    colorClasses: 'text-green-600 bg-green-50',
    label: 'On Time',
  },
  'Slow': {
    icon: Clock,
    colorClasses: 'text-yellow-600 bg-yellow-50',
    label: 'Slow',
  },
  'Partial Payer': {
    icon: AlertTriangle,
    colorClasses: 'text-orange-600 bg-orange-50',
    label: 'Partial',
  },
  'Problematic': {
    icon: XCircle,
    colorClasses: 'text-red-600 bg-red-50',
    label: 'Problematic',
  },
};

export function PaymentPatternBadge({ pattern }: PaymentPatternBadgeProps) {
  const config = patternConfig[pattern];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium ${config.colorClasses}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}
