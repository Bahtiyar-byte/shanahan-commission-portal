import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, Settings, Truck } from 'lucide-react';
import type { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onViewToggle?: () => void;
  isAdminView?: boolean;
  onNavigate?: (page: string) => void;
}

export function Header({ user, onViewToggle, isAdminView, onNavigate }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <header className="bg-[#1B7340] text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SHANAHAN</h1>
            <p className="text-xs text-white/80 uppercase tracking-wider">Commission Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Dev mode toggle */}
          {onViewToggle && (
            <button
              onClick={onViewToggle}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/20"
            >
              Switch to {isAdminView ? 'Salesperson' : 'Admin'} View
            </button>
          )}

          <div className="text-right text-sm hidden md:block">
            <p className="text-white/90">{currentDate}</p>
            <p className="text-white/60">{currentTime}</p>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 bg-[#2D8B4E] rounded-full flex items-center justify-center font-semibold border-2 border-white/30">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-white/70 capitalize">({user.role})</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-100">
                <button
                  onClick={() => {
                    onNavigate?.('profile');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E8F5E9] transition-colors"
                >
                  <User className="w-4 h-4 text-[#1B7340]" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('settings');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E8F5E9] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#1B7340]" />
                  Settings
                </button>
                <hr className="my-1" />
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
