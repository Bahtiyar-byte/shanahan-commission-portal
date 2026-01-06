import { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { type Column, StatusPill, FilterBar, ExportButton, LoadDetailModal } from '../../components/common';
import { getLoadsBySalesperson } from '../../data/mockData';
import type { Load } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getRowColor = (load: Load) => {
  if (load.status === 'Paid') return 'bg-green-50';
  if (load.status === 'Disputed') return 'bg-purple-50';
  if (load.daysOutstanding > 45) return 'bg-red-50';
  if (load.daysOutstanding > 30) return 'bg-orange-50';
  return '';
};

export function MyLoadsTab() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

  const mikeLoads = getLoadsBySalesperson('sp-1');

  const filteredLoads = useMemo(() => {
    return mikeLoads.filter((load) => {
      const matchesSearch =
        load.loadNumber.includes(searchValue) ||
        load.customerName.toLowerCase().includes(searchValue.toLowerCase());
      const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [mikeLoads, searchValue, statusFilter]);

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
      key: 'billedAmount',
      header: 'Amount',
      sortable: true,
      render: (load) => (
        <span className="tabular-nums font-medium">{formatCurrency(load.billedAmount)}</span>
      ),
    },
    {
      key: 'myCommission',
      header: 'My Commission',
      sortable: true,
      render: (load) => {
        const myCommission = load.commissionRecipients.find(
          (r) => r.name === 'Mike Bronowski'
        );
        return (
          <span className="tabular-nums font-semibold text-[#0d9488]">
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
    {
      key: 'daysOutstanding',
      header: 'Days Out',
      sortable: true,
      render: (load) => (
        <span
          className={`tabular-nums font-medium ${
            load.daysOutstanding > 30
              ? 'text-red-600'
              : load.daysOutstanding > 14
              ? 'text-yellow-600'
              : 'text-gray-600'
          }`}
        >
          {load.daysOutstanding > 0 ? load.daysOutstanding : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (load) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLoad(load);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#0d9488] hover:bg-[#0d9488]/10 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    },
  ];

  // Color legend
  const ColorLegend = () => (
    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-4">
      <span className="font-medium">Color Key:</span>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-green-200 border border-green-300" />
        <span>Paid</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-yellow-200 border border-yellow-300" />
        <span>Pending &lt;30 days</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-orange-200 border border-orange-300" />
        <span>Pending 30-45 days</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-red-200 border border-red-300" />
        <span>Pending &gt;45 days</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-purple-200 border border-purple-300" />
        <span>Disputed</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My Loads</h2>
        <ExportButton />
      </div>

      <ColorLegend />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          showDateRange={true}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLoads.map((load) => (
                <tr
                  key={load.id}
                  onClick={() => setSelectedLoad(load)}
                  className={`${getRowColor(load)} hover:bg-blue-50 cursor-pointer transition-colors`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm text-gray-900 ${col.className || ''}`}>
                      {col.render ? col.render(load) : String((load as unknown as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLoads.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No loads found matching your criteria
            </div>
          )}
        </div>
      </div>

      <LoadDetailModal
        load={selectedLoad}
        isOpen={!!selectedLoad}
        onClose={() => setSelectedLoad(null)}
        showAllCommissions={false}
      />
    </div>
  );
}
