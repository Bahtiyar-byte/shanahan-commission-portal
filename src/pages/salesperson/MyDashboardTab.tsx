import { DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { MetricCard, ProgressBar, ScoreBadge } from '../../components/common';
import { EarningsLineChart, CommissionDonut } from '../../components/charts';
import {
  mikeMetrics,
  mikeMonthlyEarnings,
  mikeCommissionBreakdown,
  getLoadsBySalesperson,
} from '../../data/mockData';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function MyDashboardTab() {
  // Get Mike's loads that need attention
  const mikeLoads = getLoadsBySalesperson('sp-1');
  const actionRequiredLoads = mikeLoads.filter(
    (load) => load.status === 'Overdue' || load.status === 'Partial' || load.daysOutstanding > 14
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="My Pending Commissions"
          value={formatCurrency(mikeMetrics.pendingCommissions)}
          icon={<DollarSign className="w-6 h-6" />}
          colorClass="text-yellow-600"
        />
        <MetricCard
          title="Paid This Month"
          value={formatCurrency(mikeMetrics.paidThisMonth)}
          icon={<DollarSign className="w-6 h-6" />}
          colorClass="text-green-600"
        />
        <MetricCard
          title="Paid YTD"
          value={formatCurrency(mikeMetrics.paidYTD)}
          icon={<TrendingUp className="w-6 h-6" />}
          colorClass="text-[#0d9488]"
        />
        <MetricCard
          title="Loads Awaiting Payment"
          value={mikeMetrics.loadsAwaitingPayment}
          icon={<Package className="w-6 h-6" />}
          colorClass="text-gray-600"
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500 mb-1">My Performance Score</p>
          <div className="flex items-center gap-2">
            <ScoreBadge score={mikeMetrics.performanceScore} size="lg" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        current={mikeMetrics.paidThisMonth}
        target={mikeMetrics.monthlyTarget}
        label="Monthly Target Progress"
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Action Required Panel - 60% */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Action Required</h3>
          </div>

          {actionRequiredLoads.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No loads require immediate attention</p>
          ) : (
            <div className="space-y-3">
              {actionRequiredLoads.map((load) => {
                const myCommission = load.commissionRecipients.find(
                  (r) => r.name === 'Mike Bronowski'
                );
                return (
                  <div
                    key={load.id}
                    className="flex items-start justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {load.customerName}
                        </span>
                        <span className="text-sm text-gray-500">
                          — Load #{load.loadNumber}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {load.daysOutstanding} days overdue —{' '}
                        <span className="font-medium text-yellow-700">
                          {formatCurrency(myCommission?.calculated || 0)} commission waiting
                        </span>
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        load.status === 'Overdue'
                          ? 'bg-red-100 text-red-800'
                          : load.status === 'Partial'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {load.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Charts - 40% */}
        <div className="lg:col-span-2 space-y-6">
          <EarningsLineChart
            data={mikeMonthlyEarnings}
            title="My Monthly Earnings (Last 6 Months)"
          />
          <CommissionDonut
            data={mikeCommissionBreakdown}
            title="Commission Status Breakdown"
          />
        </div>
      </div>
    </div>
  );
}
