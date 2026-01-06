import { useState, useMemo } from 'react';
import { Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { type Column, ScoreBadge, FilterBar, ExportButton, LoadDetailModal } from '../../components/common';
import { salespeople, getLoadsBySalesperson } from '../../data/mockData';
import type { Salesperson, Load } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function SalespeopleTab() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

  const filteredSalespeople = useMemo(() => {
    return salespeople.filter((sp) =>
      sp.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const columns: Column<Salesperson>[] = [
    {
      key: 'expand',
      header: '',
      render: (sp) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(sp.id);
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {expandedRows.has(sp.id) ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
      ),
      className: 'w-10',
    },
    {
      key: 'name',
      header: 'Salesperson Name',
      sortable: true,
      render: (sp) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0d9488] rounded-full flex items-center justify-center text-white text-sm font-medium">
            {sp.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <span className="font-medium">{sp.name}</span>
        </div>
      ),
    },
    {
      key: 'activeLoads',
      header: 'Active Loads',
      sortable: true,
      render: (sp) => <span className="tabular-nums">{sp.activeLoads}</span>,
    },
    {
      key: 'pendingCommissions',
      header: 'Pending Commissions',
      sortable: true,
      render: (sp) => (
        <span className="tabular-nums font-medium text-yellow-700">
          {formatCurrency(sp.pendingCommissions)}
        </span>
      ),
    },
    {
      key: 'paidYTD',
      header: 'Paid YTD',
      sortable: true,
      render: (sp) => (
        <span className="tabular-nums font-medium text-green-700">
          {formatCurrency(sp.paidYTD)}
        </span>
      ),
    },
    {
      key: 'avgDaysToCollection',
      header: 'Avg Days',
      sortable: true,
      render: (sp) => <span className="tabular-nums">{sp.avgDaysToCollection}</span>,
    },
    {
      key: 'performanceScore',
      header: 'Performance',
      sortable: true,
      render: (sp) => <ScoreBadge score={sp.performanceScore} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (sp) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(sp.id);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#0d9488] hover:bg-[#0d9488]/10 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Partial':
        return 'bg-orange-100 text-orange-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Disputed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Salespeople Overview</h2>
        <ExportButton />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          showDateRange={false}
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
              {filteredSalespeople.map((sp, index) => (
                <>
                  <tr
                    key={sp.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50 cursor-pointer transition-colors`}
                    onClick={() => toggleExpand(sp.id)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 text-sm text-gray-900 ${col.className || ''}`}>
                        {col.render ? col.render(sp) : String((sp as unknown as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                  {expandedRows.has(sp.id) && (
                    <tr key={`${sp.id}-expanded`}>
                      <td colSpan={columns.length} className="px-4 py-4 bg-gray-50">
                        <div className="ml-8">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            {sp.name}'s Loads
                          </h4>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-xs text-gray-500 uppercase">
                                <th className="pb-2">Load #</th>
                                <th className="pb-2">Customer</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Commission</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Days Out</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getLoadsBySalesperson(sp.id).map((load) => (
                                <tr
                                  key={load.id}
                                  className="border-t border-gray-200 hover:bg-gray-100 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLoad(load);
                                  }}
                                >
                                  <td className="py-2 font-medium">#{load.loadNumber}</td>
                                  <td className="py-2">{load.customerName}</td>
                                  <td className="py-2 tabular-nums">{formatCurrency(load.billedAmount)}</td>
                                  <td className="py-2 tabular-nums font-medium">
                                    {formatCurrency(load.commissionRecipients[0]?.calculated || 0)}
                                  </td>
                                  <td className="py-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(load.status)}`}>
                                      {load.status}
                                    </span>
                                  </td>
                                  <td className="py-2 tabular-nums">
                                    {load.daysOutstanding > 0 ? load.daysOutstanding : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LoadDetailModal
        load={selectedLoad}
        isOpen={!!selectedLoad}
        onClose={() => setSelectedLoad(null)}
        showAllCommissions={true}
      />
    </div>
  );
}
