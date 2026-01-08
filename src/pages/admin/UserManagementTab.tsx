import { useState } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Edit2,
  Trash2,
  Copy,
  Lock,
  Unlock,
  MoreVertical,
  Mail,
  Crown,
  UserCog,
  Briefcase,
  HeadphonesIcon,
  Calculator,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import type { ManagedUser, UserPermissions, PermissionPreset, PermissionScope, UserRole } from '../../types';
import { managedUsers, permissionPresets } from '../../data/mockData';

const roleIcons: Record<UserRole, React.ReactNode> = {
  owner: <Crown className="w-4 h-4" />,
  admin: <Shield className="w-4 h-4" />,
  manager: <UserCog className="w-4 h-4" />,
  salesperson: <Briefcase className="w-4 h-4" />,
  csr: <HeadphonesIcon className="w-4 h-4" />,
  accounting: <Calculator className="w-4 h-4" />,
};

const roleColors: Record<UserRole, string> = {
  owner: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  manager: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  salesperson: 'bg-green-100 text-green-800 border-green-200',
  csr: 'bg-orange-100 text-orange-800 border-orange-200',
  accounting: 'bg-cyan-100 text-cyan-800 border-cyan-200',
};

const scopeColors: Record<PermissionScope, string> = {
  none: 'bg-red-100 text-red-700',
  own: 'bg-yellow-100 text-yellow-700',
  team: 'bg-blue-100 text-blue-700',
  all: 'bg-green-100 text-green-700',
};

const permissionLabels: Record<keyof UserPermissions, { label: string; description: string; category: string }> = {
  viewCommissions: { label: 'View Commissions', description: 'Access commission data', category: 'Visibility' },
  viewCommissionRates: { label: 'View Rates', description: 'See percentage rates', category: 'Visibility' },
  viewOthersCommissions: { label: 'View Others', description: 'See colleagues\' earnings', category: 'Visibility' },
  viewLoads: { label: 'View Loads', description: 'Access load records', category: 'Visibility' },
  viewCustomers: { label: 'View Customers', description: 'Access customer records', category: 'Visibility' },
  viewCustomerScores: { label: 'Customer Scores', description: 'See trust scores', category: 'Financial' },
  viewSalespersonScores: { label: 'Performance Scores', description: 'See performance scores', category: 'Financial' },
  viewFinancialDetails: { label: 'Financial Details', description: 'Billed/received amounts', category: 'Financial' },
  viewOutstandingAmounts: { label: 'Outstanding', description: 'See what\'s owed', category: 'Financial' },
  viewPaymentHistory: { label: 'Payment History', description: 'See payment patterns', category: 'Financial' },
  canAddNotes: { label: 'Add Notes', description: 'Add notes to loads', category: 'Actions' },
  canTagUsers: { label: 'Tag Users', description: '@mention others', category: 'Actions' },
  canFlagDisputes: { label: 'Flag Disputes', description: 'Mark disputed loads', category: 'Actions' },
  canExportData: { label: 'Export Data', description: 'Export to CSV/Excel', category: 'Actions' },
  canManageCommissionRuns: { label: 'Commission Runs', description: 'Create/finalize runs', category: 'Admin' },
  canEditCommissionRates: { label: 'Edit Rates', description: 'Change rate configs', category: 'Admin' },
  canManageUsers: { label: 'Manage Users', description: 'Add/edit users', category: 'Admin' },
  canManagePermissions: { label: 'Permissions', description: 'Change permissions', category: 'Admin' },
  canViewAllReports: { label: 'All Reports', description: 'Access all analytics', category: 'Admin' },
  canConfigureSystem: { label: 'System Config', description: 'System settings', category: 'Admin' },
};

export function UserManagementTab() {
  const [users, setUsers] = useState<ManagedUser[]>(managedUsers);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'active' && user.isActive) ||
                          (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handlePresetChange = (userId: string, preset: PermissionPreset) => {
    const newPermissions = { ...permissionPresets[preset] };
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, permissionPreset: preset, permissions: newPermissions } : u
    ));
  };

  const handlePermissionChange = (userId: string, key: keyof UserPermissions, value: boolean | PermissionScope) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return {
        ...u,
        permissionPreset: 'custom' as PermissionPreset,
        permissions: { ...u.permissions, [key]: value }
      };
    }));
  };

  const handleToggleActive = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderScopeSelector = (userId: string, key: keyof UserPermissions, value: PermissionScope) => (
    <div className="flex gap-1">
      {(['none', 'own', 'team', 'all'] as PermissionScope[]).map(scope => (
        <button
          key={scope}
          onClick={() => handlePermissionChange(userId, key, scope)}
          className={`px-2 py-1 text-xs font-medium rounded transition-all ${
            value === scope
              ? scopeColors[scope] + ' ring-2 ring-offset-1 ring-gray-300'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {scope === 'none' ? 'None' : scope === 'own' ? 'Own' : scope === 'team' ? 'Team' : 'All'}
        </button>
      ))}
    </div>
  );

  const renderToggle = (userId: string, key: keyof UserPermissions, value: boolean) => (
    <button
      onClick={() => handlePermissionChange(userId, key, !value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        value ? 'bg-[#1B7340]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const renderPermissionGrid = (user: ManagedUser) => {
    const categories = ['Visibility', 'Financial', 'Actions', 'Admin'];

    return (
      <div className="grid grid-cols-4 gap-4">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              {category}
            </h5>
            <div className="bg-gray-50 rounded-lg p-2 space-y-2">
              {Object.entries(permissionLabels)
                .filter(([, info]) => info.category === category)
                .map(([key, info]) => {
                  const permKey = key as keyof UserPermissions;
                  const value = user.permissions[permKey];
                  const isScope = typeof value === 'string';

                  return (
                    <div key={key} className="flex items-center justify-between py-1.5 px-2 bg-white rounded border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{info.label}</p>
                      </div>
                      {isScope
                        ? renderScopeSelector(user.id, permKey, value as PermissionScope)
                        : renderToggle(user.id, permKey, value as boolean)
                      }
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage users and configure granular access permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Download className="w-4 h-4" />
            Export Users
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E8F5E9] rounded-lg">
              <Users className="w-5 h-5 text-[#1B7340]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'owner' || u.role === 'admin').length}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'salesperson').length}</p>
              <p className="text-xs text-gray-500">Salespeople</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.permissionPreset === 'custom').length}</p>
              <p className="text-xs text-gray-500">Custom Perms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm bg-white"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="salesperson">Salesperson</option>
              <option value="csr">CSR</option>
              <option value="accounting">Accounting</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`bg-white rounded-xl border transition-all ${
              expandedUserId === user.id
                ? 'border-[#1B7340] shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            } ${!user.isActive ? 'opacity-60' : ''}`}
          >
            {/* User Row */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => handleToggleExpand(user.id)}
            >
              <div className="flex items-center gap-4">
                {/* Expand Icon */}
                <div className="text-gray-400">
                  {expandedUserId === user.id
                    ? <ChevronDown className="w-5 h-5" />
                    : <ChevronRight className="w-5 h-5" />
                  }
                </div>

                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold ${
                  user.isActive ? 'bg-[#2D8B4E]' : 'bg-gray-400'
                }`}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                      {roleIcons[user.role]}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    {user.permissionPreset === 'custom' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        Custom
                      </span>
                    )}
                    {!user.isActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        <X className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </span>
                    {user.department && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {user.department}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="font-medium text-gray-700">{formatDate(user.createdAt)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="font-medium text-gray-700">{formatDateTime(user.lastLogin)}</p>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {activeMenu === user.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => { setEditingUser(user); setActiveMenu(null); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4" /> Edit User
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <RefreshCw className="w-4 h-4" /> Reset Password
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Copy className="w-4 h-4" /> Clone Permissions
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => { setShowDeleteModal(user.id); setActiveMenu(null); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" /> Delete User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Permissions Panel */}
            {expandedUserId === user.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Preset Selector */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Permission Preset:</label>
                    <select
                      value={user.permissionPreset}
                      onChange={(e) => handlePresetChange(user.id, e.target.value as PermissionPreset)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm font-medium bg-white"
                    >
                      <option value="owner">Owner (Full Access)</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="salesperson">Salesperson</option>
                      <option value="csr">Customer Service (CSR)</option>
                      <option value="accounting">Accounting</option>
                      <option value="custom">Custom</option>
                    </select>
                    <span className="text-xs text-gray-500 italic">
                      {user.permissionPreset === 'custom'
                        ? 'Individual permissions have been customized'
                        : 'Click any permission below to customize'}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>

                {/* Permission Grid */}
                {renderPermissionGrid(user)}

                {/* Permission Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Scope Legend:</p>
                  <div className="flex gap-4">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-3 h-3 rounded bg-red-100 border border-red-200"></span>
                      <span className="text-gray-600">None - No access</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></span>
                      <span className="text-gray-600">Own - Only their own data</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></span>
                      <span className="text-gray-600">Team - Their team's data</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-3 h-3 rounded bg-green-100 border border-green-200"></span>
                      <span className="text-gray-600">All - Full access</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="Smith" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="john.smith@shanahantrans.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white">
                    <option value="salesperson">Salesperson</option>
                    <option value="manager">Manager</option>
                    <option value="csr">Customer Service (CSR)</option>
                    <option value="accounting">Accounting</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="Sales" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Preset</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white">
                  <option value="salesperson">Salesperson (Default)</option>
                  <option value="manager">Manager</option>
                  <option value="csr">CSR</option>
                  <option value="accounting">Accounting</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Permissions can be customized after the user is created.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Welcome Email</p>
                    <p className="text-xs text-blue-700">An email will be sent to the user with login instructions and a temporary password.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] font-medium">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this user? All their data, including commission history and notes, will be permanently removed.
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
                <button onClick={() => setEditingUser(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#2D8B4E] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {editingUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{editingUser.name}</h4>
                  <p className="text-sm text-gray-500">{editingUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" defaultValue={editingUser.name.split(' ')[0]} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" defaultValue={editingUser.name.split(' ')[1]} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" defaultValue={editingUser.email} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select defaultValue={editingUser.role} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white">
                    <option value="salesperson">Salesperson</option>
                    <option value="manager">Manager</option>
                    <option value="csr">Customer Service (CSR)</option>
                    <option value="accounting">Accounting</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" defaultValue={editingUser.department} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
