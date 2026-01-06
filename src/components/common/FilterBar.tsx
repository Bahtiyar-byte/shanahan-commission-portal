import { Search, Calendar, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  showDateRange?: boolean;
  showGroupBy?: boolean;
  groupByValue?: string;
  onGroupByChange?: (value: string) => void;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  showDateRange = true,
  showGroupBy = false,
  groupByValue = 'none',
  onGroupByChange,
}: FilterBarProps) {
  const statusOptions: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Partial', label: 'Partial' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Disputed', label: 'Disputed' },
  ];

  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'salesperson', label: 'By Salesperson' },
    { value: 'customer', label: 'By Customer' },
    { value: 'status', label: 'By Status' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border-b border-gray-200">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
        />
      </div>

      {showDateRange && (
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <Calendar className="w-4 h-4" />
          Date Range
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {showGroupBy && onGroupByChange && (
        <select
          value={groupByValue}
          onChange={(e) => onGroupByChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
        >
          {groupByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
