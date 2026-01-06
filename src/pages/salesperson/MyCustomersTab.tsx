import { useState, useMemo } from 'react';
import { DataTable, type Column, ScoreBadge, PaymentPatternBadge, FilterBar, ExportButton } from '../../components/common';
import { getCustomersBySalesperson, getLoadsBySalesperson } from '../../data/mockData';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function MyCustomersTab() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mikeCustomers = getCustomersBySalesperson('sp-1');
  const mikeLoads = getLoadsBySalesperson('sp-1');

  // Calculate Mike-specific metrics for each customer
  const customerWithMikeData = useMemo(() => {
    return mikeCustomers.map((customer) => {
      const customerLoads = mikeLoads.filter((l) => l.customerId === customer.id);
      const openLoads = customerLoads.filter((l) => l.status !== 'Paid');
      const pendingCommission = openLoads.reduce((sum, load) => {
        const myCommission = load.commissionRecipients.find(
          (r) => r.name === 'Mike Bronowski'
        );
        return sum + (myCommission?.calculated || 0);
      }, 0);

      return {
        ...customer,
        myLoads: customerLoads.length,
        myOpenLoads: openLoads.length,
        myPendingCommission: pendingCommission,
      };
    });
  }, [mikeCustomers, mikeLoads]);

  const filteredCustomers = useMemo(() => {
    return customerWithMikeData.filter((c) =>
      c.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [customerWithMikeData, searchValue]);

  const columns: Column<typeof customerWithMikeData[0]>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (c) => <span className="font-medium">{c.name}</span>,
    },
    {
      key: 'myLoads',
      header: 'My Loads',
      sortable: true,
      render: (c) => <span className="tabular-nums">{c.myLoads}</span>,
    },
    {
      key: 'myOpenLoads',
      header: 'Open',
      sortable: true,
      render: (c) => <span className="tabular-nums">{c.myOpenLoads}</span>,
    },
    {
      key: 'myPendingCommission',
      header: 'My Pending ($)',
      sortable: true,
      render: (c) => (
        <span className={`tabular-nums font-medium ${c.myPendingCommission > 0 ? 'text-yellow-700' : 'text-gray-500'}`}>
          {formatCurrency(c.myPendingCommission)}
        </span>
      ),
    },
    {
      key: 'trustScore',
      header: 'Trust Score',
      sortable: true,
      render: (c) => <ScoreBadge score={c.trustScore} size="sm" />,
    },
    {
      key: 'paymentPattern',
      header: 'Pattern',
      render: (c) => <PaymentPatternBadge pattern={c.paymentPattern} />,
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (c) => (
        <span className="text-sm text-gray-600 italic">
          {c.notes || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Customers</h2>
          <p className="text-sm text-gray-500 mt-1">
            Customers you have active or historical loads with
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Total Customers</p>
          <p className="text-2xl font-semibold text-gray-900 tabular-nums">
            {customerWithMikeData.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">On Time Payers</p>
          <p className="text-2xl font-semibold text-green-600 tabular-nums">
            {customerWithMikeData.filter((c) => c.paymentPattern === 'On Time').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Slow/Partial Payers</p>
          <p className="text-2xl font-semibold text-yellow-600 tabular-nums">
            {customerWithMikeData.filter((c) => c.paymentPattern === 'Slow' || c.paymentPattern === 'Partial Payer').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Problematic</p>
          <p className="text-2xl font-semibold text-red-600 tabular-nums">
            {customerWithMikeData.filter((c) => c.paymentPattern === 'Problematic').length}
          </p>
        </div>
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
