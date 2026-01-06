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
  Eye,
  Edit2,
  Lock,
  Unlock,
  DollarSign,
  MessageSquare,
  Settings,
  Crown,
  UserCog,
  Briefcase,
  HeadphonesIcon,
  Calculator,
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
  owner: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  manager: 'bg-indigo-100 text-indigo-800',
  salesperson: 'bg-green-100 text-green-800',
  csr: 'bg-orange-100 text-orange-800',
  accounting: 'bg-cyan-100 text-cyan-800',
};

const presetDescriptions: Record<PermissionPreset, string> = {
  owner: 'Full access to everything. Can manage all users, permissions, and system settings.',
  admin: 'Can view all data and manage commission runs. Cannot change system settings or permissions.',
  manager: 'Can see team data, export reports, and manage their team\'s loads and customers.',
  salesperson: 'Can only see their own commissions, loads, and customers. Can add notes and tag users.',
  csr: 'Customer service access. Can see loads and customers but no financial/commission data.',
  accounting: 'Financial access. Can see all commissions, run reports, and manage commission runs.',
  custom: 'Custom permission set. Configure each permission individually.',
};

interface PermissionToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function PermissionToggle({ label, description, value, onChange, disabled }: PermissionToggleProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${disabled ? 'bg-gray-50 opacity-60' : 'bg-white border border-gray-200'}`}>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-[#1B7340]' : 'bg-gray-300'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface ScopeSelectProps {
  label: string;
  description: string;
  value: PermissionScope;
  onChange: (value: PermissionScope) => void;
  disabled?: boolean;
}

function ScopeSelect({ label, description, value, onChange, disabled }: ScopeSelectProps) {
  const scopeLabels: Record<PermissionScope, string> = {
    none: 'No Access',
    own: 'Own Only',
    team: 'Team',
    all: 'All',
  };

  const scopeColors: Record<PermissionScope, string> = {
    none: 'bg-red-100 text-red-800',
    own: 'bg-yellow-100 text-yellow-800',
    team: 'bg-blue-100 text-blue-800',
    all: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${disabled ? 'bg-gray-50 opacity-60' : 'bg-white border border-gray-200'}`}>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PermissionScope)}
        disabled={disabled}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 ${scopeColors[value]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {Object.entries(scopeLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export function PermissionsTab() {
  const [users, setUsers] = useState<ManagedUser[]>(managedUsers);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [expandedSections, setExpandedSections] = useState<string[]>(['visibility', 'financial', 'actions', 'admin']);
  const [showAddUser, setShowAddUser] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handlePresetChange = (preset: PermissionPreset) => {
    if (!selectedUser) return;
    const newPermissions = { ...permissionPresets[preset] };
    setSelectedUser({ ...selectedUser, permissionPreset: preset, permissions: newPermissions });
    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id ? { ...u, permissionPreset: preset, permissions: newPermissions } : u
    ));
  };

  const handlePermissionChange = <K extends keyof UserPermissions>(
    key: K,
    value: UserPermissions[K]
  ) => {
    if (!selectedUser) return;
    const newPermissions = { ...selectedUser.permissions, [key]: value };
    setSelectedUser({ ...selectedUser, permissions: newPermissions, permissionPreset: 'custom' });
    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id ? { ...u, permissions: newPermissions, permissionPreset: 'custom' } : u
    ));
  };

  const handleToggleActive = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
    }
  };

  const renderUserRow = (user: ManagedUser) => (
    <tr
      key={user.id}
      onClick={() => setSelectedUser(user)}
      className={`cursor-pointer transition-colors ${
        selectedUser?.id === user.id ? 'bg-[#E8F5E9]' : 'hover:bg-gray-50'
      } ${!user.isActive ? 'opacity-50' : ''}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
            user.isActive ? 'bg-[#2D8B4E]' : 'bg-gray-400'
          }`}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
          {roleIcons[user.role]}
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600">{user.department}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
          user.permissionPreset === 'custom' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
        }`}>
          {user.permissionPreset.charAt(0).toUpperCase() + user.permissionPreset.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(user.id); }}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
        >
          {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Permissions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage granular access controls for all users
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E8F5E9] rounded-lg">
              <Users className="w-5 h-5 text-[#1B7340]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-500">Total Users</p>
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
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin' || u.role === 'owner').length}</p>
              <p className="text-sm text-gray-500">Admins</p>
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
              <p className="text-sm text-gray-500">Custom Permissions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Users List */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Search & Filter */}
          <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="salesperson">Salesperson</option>
              <option value="csr">CSR</option>
              <option value="accounting">Accounting</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Preset</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(renderUserRow)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permission Editor Panel */}
        {selectedUser && (
          <div className="w-[420px] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-280px)]">
            {/* User Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#1B7340] to-[#2D8B4E]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-white/80">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preset Selector */}
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Permission Preset</label>
              <select
                value={selectedUser.permissionPreset}
                onChange={(e) => handlePresetChange(e.target.value as PermissionPreset)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm font-medium"
              >
                <option value="owner">Owner (Full Access)</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="salesperson">Salesperson</option>
                <option value="csr">Customer Service (CSR)</option>
                <option value="accounting">Accounting</option>
                <option value="custom">Custom</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">{presetDescriptions[selectedUser.permissionPreset]}</p>
            </div>

            {/* Permission Sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Visibility Permissions */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('visibility')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#1B7340]" />
                    <span className="font-medium text-gray-900">Visibility & Access</span>
                  </div>
                  {expandedSections.includes('visibility') ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSections.includes('visibility') && (
                  <div className="p-3 space-y-2">
                    <ScopeSelect
                      label="View Commissions"
                      description="Access to commission data"
                      value={selectedUser.permissions.viewCommissions}
                      onChange={(v) => handlePermissionChange('viewCommissions', v)}
                    />
                    <ScopeSelect
                      label="View Loads"
                      description="Access to load records"
                      value={selectedUser.permissions.viewLoads}
                      onChange={(v) => handlePermissionChange('viewLoads', v)}
                    />
                    <ScopeSelect
                      label="View Customers"
                      description="Access to customer records"
                      value={selectedUser.permissions.viewCustomers}
                      onChange={(v) => handlePermissionChange('viewCustomers', v)}
                    />
                    <PermissionToggle
                      label="View Commission Rates"
                      description="See actual percentage rates"
                      value={selectedUser.permissions.viewCommissionRates}
                      onChange={(v) => handlePermissionChange('viewCommissionRates', v)}
                    />
                    <PermissionToggle
                      label="View Others' Commissions"
                      description="See what colleagues earn"
                      value={selectedUser.permissions.viewOthersCommissions}
                      onChange={(v) => handlePermissionChange('viewOthersCommissions', v)}
                    />
                  </div>
                )}
              </div>

              {/* Financial Permissions */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('financial')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#1B7340]" />
                    <span className="font-medium text-gray-900">Financial Data</span>
                  </div>
                  {expandedSections.includes('financial') ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSections.includes('financial') && (
                  <div className="p-3 space-y-2">
                    <PermissionToggle
                      label="View Financial Details"
                      description="See billed/received amounts"
                      value={selectedUser.permissions.viewFinancialDetails}
                      onChange={(v) => handlePermissionChange('viewFinancialDetails', v)}
                    />
                    <PermissionToggle
                      label="View Outstanding Amounts"
                      description="See what's owed"
                      value={selectedUser.permissions.viewOutstandingAmounts}
                      onChange={(v) => handlePermissionChange('viewOutstandingAmounts', v)}
                    />
                    <PermissionToggle
                      label="View Payment History"
                      description="See payment patterns"
                      value={selectedUser.permissions.viewPaymentHistory}
                      onChange={(v) => handlePermissionChange('viewPaymentHistory', v)}
                    />
                    <PermissionToggle
                      label="View Customer Scores"
                      description="See trust scores"
                      value={selectedUser.permissions.viewCustomerScores}
                      onChange={(v) => handlePermissionChange('viewCustomerScores', v)}
                    />
                    <PermissionToggle
                      label="View Salesperson Scores"
                      description="See performance scores"
                      value={selectedUser.permissions.viewSalespersonScores}
                      onChange={(v) => handlePermissionChange('viewSalespersonScores', v)}
                    />
                  </div>
                )}
              </div>

              {/* Action Permissions */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('actions')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#1B7340]" />
                    <span className="font-medium text-gray-900">Actions</span>
                  </div>
                  {expandedSections.includes('actions') ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSections.includes('actions') && (
                  <div className="p-3 space-y-2">
                    <PermissionToggle
                      label="Add Notes"
                      description="Add notes to loads"
                      value={selectedUser.permissions.canAddNotes}
                      onChange={(v) => handlePermissionChange('canAddNotes', v)}
                    />
                    <PermissionToggle
                      label="Tag Users"
                      description="@mention other users"
                      value={selectedUser.permissions.canTagUsers}
                      onChange={(v) => handlePermissionChange('canTagUsers', v)}
                    />
                    <PermissionToggle
                      label="Flag Disputes"
                      description="Mark loads as disputed"
                      value={selectedUser.permissions.canFlagDisputes}
                      onChange={(v) => handlePermissionChange('canFlagDisputes', v)}
                    />
                    <PermissionToggle
                      label="Export Data"
                      description="Export to CSV/Excel"
                      value={selectedUser.permissions.canExportData}
                      onChange={(v) => handlePermissionChange('canExportData', v)}
                    />
                  </div>
                )}
              </div>

              {/* Admin Permissions */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('admin')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#1B7340]" />
                    <span className="font-medium text-gray-900">Administration</span>
                  </div>
                  {expandedSections.includes('admin') ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSections.includes('admin') && (
                  <div className="p-3 space-y-2">
                    <PermissionToggle
                      label="Manage Commission Runs"
                      description="Create/finalize commission runs"
                      value={selectedUser.permissions.canManageCommissionRuns}
                      onChange={(v) => handlePermissionChange('canManageCommissionRuns', v)}
                    />
                    <PermissionToggle
                      label="Edit Commission Rates"
                      description="Change rate configurations"
                      value={selectedUser.permissions.canEditCommissionRates}
                      onChange={(v) => handlePermissionChange('canEditCommissionRates', v)}
                    />
                    <PermissionToggle
                      label="Manage Users"
                      description="Add/edit/remove users"
                      value={selectedUser.permissions.canManageUsers}
                      onChange={(v) => handlePermissionChange('canManageUsers', v)}
                    />
                    <PermissionToggle
                      label="Manage Permissions"
                      description="Change user permissions"
                      value={selectedUser.permissions.canManagePermissions}
                      onChange={(v) => handlePermissionChange('canManagePermissions', v)}
                    />
                    <PermissionToggle
                      label="View All Reports"
                      description="Access all analytics"
                      value={selectedUser.permissions.canViewAllReports}
                      onChange={(v) => handlePermissionChange('canViewAllReports', v)}
                    />
                    <PermissionToggle
                      label="Configure System"
                      description="System settings access"
                      value={selectedUser.permissions.canConfigureSystem}
                      onChange={(v) => handlePermissionChange('canConfigureSystem', v)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors font-medium">
                <Check className="w-4 h-4" />
                Save Permissions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
              <button onClick={() => setShowAddUser(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="email@shanahantrans.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent">
                  <option value="salesperson">Salesperson</option>
                  <option value="manager">Manager</option>
                  <option value="csr">Customer Service (CSR)</option>
                  <option value="accounting">Accounting</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="e.g., Sales, Operations" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Preset</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent">
                  <option value="salesperson">Salesperson (Default)</option>
                  <option value="manager">Manager</option>
                  <option value="csr">CSR</option>
                  <option value="accounting">Accounting</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">You can customize individual permissions after creating the user.</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowAddUser(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] font-medium">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
