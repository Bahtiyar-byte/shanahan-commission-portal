import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  Package,
  History,
  User,
  DollarSign,
  UserCog,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isAdmin: boolean;
}

const adminNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'salespeople', label: 'By Salesperson', icon: <Users className="w-5 h-5" /> },
  { id: 'customers', label: 'By Customer', icon: <Building2 className="w-5 h-5" /> },
  { id: 'commission-runs', label: 'Commission Runs', icon: <FileText className="w-5 h-5" /> },
  { id: 'commission-rates', label: 'Commission Rates', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'user-management', label: 'User Management', icon: <UserCog className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

const salespersonNavItems: NavItem[] = [
  { id: 'my-dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'my-loads', label: 'My Loads', icon: <Package className="w-5 h-5" /> },
  { id: 'my-customers', label: 'My Customers', icon: <Building2 className="w-5 h-5" /> },
  { id: 'my-history', label: 'My History', icon: <History className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar({ activeTab, onTabChange, isAdmin }: SidebarProps) {
  const navItems = isAdmin ? adminNavItems : salespersonNavItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)]">
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-[#E8F5E9] text-[#1B7340] shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={activeTab === item.id ? 'text-[#1B7340]' : 'text-gray-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
}
