import { useState } from 'react';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { DataTable, type Column, StatusPill, ExportButton } from '../../components/common';
import { getLoadsBySalesperson, commissionRuns } from '../../data/mockData';
import type { Load } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function MyHistoryTab() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedQuarter, setSelectedQuarter] = useState('all');

  const mikeLoads = getLoadsBySalesperson('sp-1');
  const paidLoads = mikeLoads.filter((load) => load.status === 'Paid');

  const columns: Column<Load>[] = [
    {
      key: 'loadNumber',
      header: 'Load #',
      sortable: true,
      render: (load) => (
        <span className="font-semibold text-[#1e3a5f]">#{load.loadNumber}</span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (load) => <span className="font-medium">{load.customerName}</span>,
    },
    {
      key: 'deliveryDate',
      header: 'Delivery Date',
      sortable: true,
      render: (load) => (
        <span className="text-gray-600">
          {new Date(load.deliveryDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'billedAmount',
      header: 'Load Amount',
      sortable: true,
      render: (load) => (
        <span className="tabular-nums font-medium">{formatCurrency(load.billedAmount)}</span>
      ),
    },
    {
      key: 'commission',
      header: 'Commission Earned',
      sortable: true,
      render: (load) => {
        const myCommission = load.commissionRecipients.find(
          (r) => r.name === 'Mike Bronowski'
        );
        return (
          <span className="tabular-nums font-semibold text-green-600">
            {formatCurrency(myCommission?.calculated || 0)}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (load) => <StatusPill status={load.status} size="sm" />,
    },
  ];

  // Commission Run History for Mike
  const mikeCommissionRuns = commissionRuns.filter((r) => r.status === 'Finalized');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My History</h2>
          <p className="text-sm text-gray-500 mt-1">
            View your historical commissions and earnings
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-500">Total Earned (YTD)</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">
            {formatCurrency(34567)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">Commission Runs</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">
            {mikeCommissionRuns.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500">Avg Per Run</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">
            {formatCurrency(34567 / (mikeCommissionRuns.length || 1))}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
        <select
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
        >
          <option value="all">All Quarters</option>
          <option value="q1">Q1 (Jan-Mar)</option>
          <option value="q2">Q2 (Apr-Jun)</option>
          <option value="q3">Q3 (Jul-Sep)</option>
          <option value="q4">Q4 (Oct-Dec)</option>
        </select>
      </div>

      {/* Commission Run History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Commission Run History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Run ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Period
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                My Earnings
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mikeCommissionRuns.map((run, index) => {
              // Simulate Mike's portion (roughly 25% of total)
              const mikeEarnings = Math.round(run.totalAmount * 0.25);
              return (
                <tr key={run.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 text-sm font-medium text-[#1e3a5f]">
                    #{run.runId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{run.period}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(run.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600 text-right tabular-nums">
                    {formatCurrency(mikeEarnings)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={run.status} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paid Loads History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Paid Loads</h3>
        </div>
        <DataTable
          data={paidLoads}
          columns={columns}
          keyExtractor={(load) => load.id}
          emptyMessage="No paid loads found"
        />
      </div>
    </div>
  );
}
