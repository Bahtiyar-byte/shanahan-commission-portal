import { FileText, Edit, Download } from 'lucide-react';
import { DataTable, type Column, StatusPill, ExportButton } from '../../components/common';
import { commissionRuns } from '../../data/mockData';
import type { CommissionRun } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function CommissionRunsTab() {
  const columns: Column<CommissionRun>[] = [
    {
      key: 'runId',
      header: 'Run ID',
      sortable: true,
      render: (run) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-[#1e3a5f]">#{run.runId}</span>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      sortable: true,
      render: (run) => <span className="text-gray-700">{run.period}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (run) => <StatusPill status={run.status} size="sm" />,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      sortable: true,
      render: (run) => (
        <span className="tabular-nums font-semibold text-gray-900">
          {formatCurrency(run.totalAmount)}
        </span>
      ),
    },
    {
      key: 'salespeopleCount',
      header: 'Salespeople',
      sortable: true,
      render: (run) => <span className="tabular-nums">{run.salespeopleCount}</span>,
    },
    {
      key: 'createdDate',
      header: 'Created',
      sortable: true,
      render: (run) => (
        <span className="text-gray-600">
          {new Date(run.createdDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (run) => (
        <div className="flex items-center gap-2">
          {run.status === 'Draft' ? (
            <>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#0d9488] hover:bg-[#0d9488]/10 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0b7c72] rounded-lg transition-colors">
                Finalize
              </button>
            </>
          ) : (
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              View PDF
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Commission Runs</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage commission calculation periods and payouts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
          <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c4f7a] transition-colors text-sm font-medium">
            Create New Run
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable
          data={commissionRuns}
          columns={columns}
          keyExtractor={(run) => run.id}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Total Finalized This Year</p>
          <p className="text-2xl font-semibold text-gray-900 tabular-nums">
            {formatCurrency(commissionRuns.filter(r => r.status === 'Finalized').reduce((sum, r) => sum + r.totalAmount, 0))}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Runs This Year</p>
          <p className="text-2xl font-semibold text-gray-900 tabular-nums">
            {commissionRuns.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Draft Runs</p>
          <p className="text-2xl font-semibold text-yellow-600 tabular-nums">
            {commissionRuns.filter(r => r.status === 'Draft').length}
          </p>
        </div>
      </div>
    </div>
  );
}
