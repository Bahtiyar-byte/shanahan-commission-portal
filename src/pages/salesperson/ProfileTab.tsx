import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  Edit2,
  Award,
  TrendingUp,
  DollarSign,
  Target,
} from 'lucide-react';
import { salespersonUser, mikeMetrics, getCustomersBySalesperson } from '../../data/mockData';

export function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: salespersonUser.name,
    email: salespersonUser.email,
    phone: '(412) 555-0456',
    address: 'Pittsburgh, PA',
    joinDate: 'March 2020',
    role: 'Senior Sales Representative',
    territory: 'Northeast Region',
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isEditing
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-[#1B7340] text-white hover:bg-[#155c33]'
          }`}
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-[#1B7340] to-[#2D8B4E]" />

        {/* Avatar Section */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 bg-[#2D8B4E] rounded-xl flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex-1 pt-4 sm:pt-0">
              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] text-[#1B7340] text-sm font-medium rounded-full">
                <Target className="w-4 h-4" />
                {profile.territory}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#1B7340]" />
            Contact Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1B7340]" />
            Account Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
              <p className="text-gray-900 font-medium">{profile.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Territory</label>
              <p className="text-gray-900">{profile.territory}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Member Since
              </label>
              <p className="text-gray-900">{profile.joinDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
              <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1B7340]" />
          My Performance
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#E8F5E9] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1B7340] rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">YTD Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${mikeMetrics.paidYTD.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#E8F5E9] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1B7340] rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Loads Awaiting</p>
                <p className="text-2xl font-bold text-gray-900">{mikeMetrics.loadsAwaitingPayment}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#E8F5E9] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1B7340] rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Target</p>
                <p className="text-2xl font-bold text-gray-900">${mikeMetrics.monthlyTarget.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#E8F5E9] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1B7340] rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{getCustomersBySalesperson(salespersonUser.id).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
