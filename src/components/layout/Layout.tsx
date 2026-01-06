import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { User } from '../../types';

interface LayoutProps {
  children: ReactNode;
  user: User;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onViewToggle?: () => void;
  isAdminView?: boolean;
}

export function Layout({
  children,
  user,
  activeTab,
  onTabChange,
  onViewToggle,
  isAdminView,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header
        user={user}
        onViewToggle={onViewToggle}
        isAdminView={isAdminView}
        onNavigate={onTabChange}
      />
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          isAdmin={user.role === 'admin'}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
