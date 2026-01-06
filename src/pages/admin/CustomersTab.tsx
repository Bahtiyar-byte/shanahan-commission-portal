import { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import { DataTable, type Column, ScoreBadge, PaymentPatternBadge, FilterBar, ExportButton } from '../../components/common';
import { customers, salespeople } from '../../data/mockData';
import type { Customer } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function CustomersTab() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredCustomer, setHoveredCustomer] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      c.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const getSalespersonNames = (ids: string[]) => {
    return ids
      .map((id) => salespeople.find((sp) => sp.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer Name',
      sortable: true,
      render: (c) => <span className="font-medium">{c.name}</span>,
    },
    {
      key: 'totalLoads',
      header: 'Total Loads',
      sortable: true,
      render: (c) => <span className="tabular-nums">{c.totalLoads}</span>,
    },
    {
      key: 'openInvoices',
      header: 'Open Invoices',
      sortable: true,
      render: (c) => <span className="tabular-nums">{c.openInvoices}</span>,
    },
    {
      key: 'outstandingAmount',
      header: 'Outstanding',
      sortable: true,
      render: (c) => (
        <span className={`tabular-nums font-medium ${c.outstandingAmount > 10000 ? 'text-red-600' : 'text-gray-900'}`}>
          {formatCurrency(c.outstandingAmount)}
        </span>
      ),
    },
    {
      key: 'avgPaymentDays',
      header: 'Avg Days',
      sortable: true,
      render: (c) => (
        <span className={`tabular-nums ${c.avgPaymentDays > 30 ? 'text-red-600' : c.avgPaymentDays > 21 ? 'text-yellow-600' : 'text-green-600'}`}>
          {c.avgPaymentDays}
        </span>
      ),
    },
    {
      key: 'trustScore',
      header: 'Trust Score',
      sortable: true,
      render: (c) => (
        <div className="relative inline-flex items-center gap-2">
          <ScoreBadge score={c.trustScore} size="sm" />
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onMouseEnter={() => setHoveredCustomer(c.id)}
            onMouseLeave={() => setHoveredCustomer(null)}
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>
          {hoveredCustomer === c.id && (
            <div className="absolute left-full ml-2 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
              <p className="font-semibold mb-2">Trust Score Breakdown</p>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span>Payment Timeliness</span>
                  <span>40%</span>
                </li>
                <li className="flex justify-between">
                  <span>Partial Payment Frequency</span>
                  <span>25%</span>
                </li>
                <li className="flex justify-between">
                  <span>Dispute Frequency</span>
                  <span>20%</span>
                </li>
                <li className="flex justify-between">
                  <span>Communication</span>
                  <span>15%</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'paymentPattern',
      header: 'Pattern',
      render: (c) => <PaymentPatternBadge pattern={c.paymentPattern} />,
    },
    {
      key: 'assignedSalespersonIds',
      header: 'Assigned To',
      render: (c) => (
        <span className="text-sm text-gray-600">
          {getSalespersonNames(c.assignedSalespersonIds)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Customer Overview</h2>
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

        <DataTable
          data={filteredCustomers}
          columns={columns}
          keyExtractor={(c) => c.id}
        />
      </div>
    </div>
  );
}
