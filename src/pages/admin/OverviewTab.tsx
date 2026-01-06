import { DollarSign, CreditCard, Package, Clock, Activity } from 'lucide-react';
import { MetricCard } from '../../components/common';
import { DistributionPie, PaymentTrendChart } from '../../components/charts';
import {
  adminMetrics,
  activityEvents,
  commissionDistributionData,
  weeklyPaymentData,
} from '../../data/mockData';

const getActivityIcon = (iconName: string) => {
  switch (iconName) {
    case 'DollarSign':
      return <DollarSign className="w-4 h-4 text-green-600" />;
    case 'CreditCard':
      return <CreditCard className="w-4 h-4 text-blue-600" />;
    case 'Flag':
      return <Activity className="w-4 h-4 text-orange-600" />;
    case 'CheckCircle':
      return <Activity className="w-4 h-4 text-purple-600" />;
    default:
      return <Activity className="w-4 h-4 text-gray-600" />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getHealthScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Outstanding Commissions"
          value={formatCurrency(adminMetrics.totalOutstandingCommissions)}
          icon={<DollarSign className="w-6 h-6" />}
          colorClass="text-[#1e3a5f]"
        />
        <MetricCard
          title="Commissions Paid This Month"
          value={formatCurrency(adminMetrics.commissionsPaidThisMonth)}
          icon={<CreditCard className="w-6 h-6" />}
          colorClass="text-green-600"
        />
        <MetricCard
          title="Pending Loads Awaiting Payment"
          value={adminMetrics.pendingLoadsCount}
          icon={<Package className="w-6 h-6" />}
          colorClass="text-yellow-600"
        />
        <MetricCard
          title="Average Days to Payment"
          value={`${adminMetrics.avgDaysToPayment} days`}
          icon={<Clock className="w-6 h-6" />}
          colorClass="text-gray-600"
        />
        <MetricCard
          title="Collection Health Score"
          value={`${adminMetrics.collectionHealthScore}/100`}
          icon={<Activity className="w-6 h-6" />}
          colorClass={getHealthScoreColor(adminMetrics.collectionHealthScore)}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Activity Feed - 60% */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getActivityIcon(event.icon)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{event.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts - 40% */}
        <div className="lg:col-span-2 space-y-6">
          <DistributionPie
            data={commissionDistributionData}
            title="Commission Distribution by Salesperson"
          />
          <PaymentTrendChart
            data={weeklyPaymentData}
            title="Payments: Received vs Outstanding (Last 8 Weeks)"
          />
        </div>
      </div>
    </div>
  );
}
