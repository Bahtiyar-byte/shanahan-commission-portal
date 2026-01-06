import { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

type SettingsSection = 'notifications' | 'security' | 'preferences';

export function SettingsTab() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('notifications');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      commissionPaid: true,
      newLoad: true,
      weeklyReport: true,
      monthlyReport: true,
    },
    push: {
      commissionPaid: true,
      newLoad: false,
      weeklyReport: false,
      monthlyReport: false,
    },
  });

  const sections = [
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'preferences' as const, label: 'Preferences', icon: Settings },
  ];

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#1B7340]" />
          Email Notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: 'commissionPaid', label: 'Commission Paid', description: 'Get notified when your commission is paid' },
            { key: 'newLoad', label: 'New Load Assigned', description: 'Receive alerts for new load assignments' },
            { key: 'weeklyReport', label: 'Weekly Summary', description: 'Weekly performance summary' },
            { key: 'monthlyReport', label: 'Monthly Report', description: 'Monthly earnings and performance report' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, [item.key]: !notifications.email[item.key as keyof typeof notifications.email] }
                })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.email[item.key as keyof typeof notifications.email] ? 'bg-[#1B7340]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    notifications.email[item.key as keyof typeof notifications.email] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#1B7340]" />
          Push Notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: 'commissionPaid', label: 'Commission Paid', description: 'Mobile push when commission is paid' },
            { key: 'newLoad', label: 'New Load Assigned', description: 'Mobile push for new loads' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({
                  ...notifications,
                  push: { ...notifications.push, [item.key]: !notifications.push[item.key as keyof typeof notifications.push] }
                })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.push[item.key as keyof typeof notifications.push] ? 'bg-[#1B7340]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    notifications.push[item.key as keyof typeof notifications.push] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#1B7340]" />
          Change Password
        </h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
          <button className="px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors font-medium">
            Update Password
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#1B7340]" />
          Two-Factor Authentication
        </h3>
        <div className="p-4 bg-[#E8F5E9] rounded-lg border border-[#1B7340]/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1B7340] rounded-lg">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">2FA is enabled</p>
              <p className="text-sm text-gray-600 mt-1">Your account is protected with two-factor authentication via authenticator app.</p>
              <button className="mt-3 text-sm text-[#1B7340] hover:text-[#155c33] font-medium">
                Manage 2FA Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Currency Display</p>
              <p className="text-sm text-gray-500">How currency values are displayed</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent">
              <option>USD ($)</option>
              <option>EUR (&euro;)</option>
              <option>GBP (&pound;)</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Date Format</p>
              <p className="text-sm text-gray-500">How dates are displayed throughout the app</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Time Zone</p>
              <p className="text-sm text-gray-500">Your local time zone for scheduling</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent">
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
              <option>Mountain Time (MT)</option>
              <option>Pacific Time (PT)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Default Dashboard View</p>
              <p className="text-sm text-gray-500">Page shown when you first log in</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent">
              <option>My Dashboard</option>
              <option>My Loads</option>
              <option>My Customers</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Items per Page</p>
              <p className="text-sm text-gray-500">Number of items shown in lists</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#E8F5E9] text-[#1B7340]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeSection === 'notifications' && renderNotificationsSection()}
          {activeSection === 'security' && renderSecuritySection()}
          {activeSection === 'preferences' && renderPreferencesSection()}
        </div>
      </div>
    </div>
  );
}
