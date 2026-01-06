import { useState } from 'react';
import {
  Save,
  User,
  Bell,
  DollarSign,
  Lock,
  Mail,
  Globe,
} from 'lucide-react';

export function SettingsTab() {
  const [activeSection, setActiveSection] = useState('general');
  const [commissionRates, setCommissionRates] = useState({
    tlSales: { min: 8, max: 12 },
    ltlSales: { min: 5, max: 8 },
    csr: { min: 2, max: 3 },
  });

  const [notifications, setNotifications] = useState({
    paymentReceived: true,
    newDispute: true,
    commissionRunFinalized: true,
    overdueAlert: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const [general, setGeneral] = useState({
    companyName: 'Shanahan Transportation Systems, Inc.',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  });

  const sections = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'commissions', label: 'Commissions', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure system preferences and commission parameters
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-[#E8F5E9] text-[#1B7340]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={activeSection === section.id ? 'text-[#1B7340]' : 'text-gray-400'}>
                  {section.icon}
                </span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-[#E8F5E9] rounded-lg">
                  <Globe className="w-5 h-5 text-[#1B7340]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">General Settings</h3>
                  <p className="text-sm text-gray-500">Basic system configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={general.companyName}
                    onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={general.timezone}
                    onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={general.currency}
                    onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={general.dateFormat}
                    onChange={(e) => setGeneral({ ...general, dateFormat: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Commission Settings */}
          {activeSection === 'commissions' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-[#E8F5E9] rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#1B7340]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Commission Rates</h3>
                  <p className="text-sm text-gray-500">Define commission rate ranges by role</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    TL Sales Commission (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Minimum</label>
                      <input
                        type="number"
                        value={commissionRates.tlSales.min}
                        onChange={(e) =>
                          setCommissionRates({
                            ...commissionRates,
                            tlSales: { ...commissionRates.tlSales, min: Number(e.target.value) },
                          })
                        }
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-400 pt-5">to</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Maximum</label>
                      <input
                        type="number"
                        value={commissionRates.tlSales.max}
                        onChange={(e) =>
                          setCommissionRates({
                            ...commissionRates,
                            tlSales: { ...commissionRates.tlSales, max: Number(e.target.value) },
                          })
                        }
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    LTL Sales Commission (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Minimum</label>
                      <input
                        type="number"
                        value={commissionRates.ltlSales.min}
                        onChange={(e) =>
                          setCommissionRates({
                            ...commissionRates,
                            ltlSales: { ...commissionRates.ltlSales, min: Number(e.target.value) },
                          })
                        }
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-400 pt-5">to</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Maximum</label>
                      <input
                        type="number"
                        value={commissionRates.ltlSales.max}
                        onChange={(e) =>
                          setCommissionRates({
                            ...commissionRates,
                            ltlSales: { ...commissionRates.ltlSales, max: Number(e.target.value) },
                          })
                        }
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    CSR Commission (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Minimum</label>
                      <input
                        type="number"
                        value={commissionRates.csr.min}
                        onChange={(e) =>
                          setCommissionRates({
                            ...commissionRates,
                            csr: { ...commissionRates.csr, min: Number(e.target.value) },
                          })
                        }
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-400 pt-5">to</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Maximum</label>
                      <input
                        type="number"
                        value={commissionRates.csr.max}
                        onChange={(e) =>
                          setCommissionRates({
                            ...commissionRates,
                            csr: { ...commissionRates.csr, max: Number(e.target.value) },
                          })
                        }
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-[#E8F5E9] rounded-lg">
                  <Bell className="w-5 h-5 text-[#1B7340]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">Configure email and in-app notifications</p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {key === 'paymentReceived' && 'Payment Received'}
                        {key === 'newDispute' && 'New Dispute Filed'}
                        {key === 'commissionRunFinalized' && 'Commission Run Finalized'}
                        {key === 'overdueAlert' && 'Overdue Payment Alert'}
                        {key === 'weeklyReport' && 'Weekly Summary Report'}
                        {key === 'monthlyReport' && 'Monthly Summary Report'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setNotifications({ ...notifications, [key]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${value ? 'bg-[#1B7340]' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-[#E8F5E9] rounded-lg">
                  <Lock className="w-5 h-5 text-[#1B7340]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-500">Manage your account security settings</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Change Password</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                    />
                  </div>
                  <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    Update Password
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors text-sm font-medium">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E8F5E9] rounded-lg">
                    <User className="w-5 h-5 text-[#1B7340]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors text-sm font-medium">
                  Add User
                </button>
              </div>

              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>User management features coming soon</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors font-medium">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
