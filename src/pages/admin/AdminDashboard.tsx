import { useState } from 'react';
import { Layout } from '../../components/layout';
import { adminUser } from '../../data/mockData';
import { OverviewTab } from './OverviewTab';
import { SalespeopleTab } from './SalespeopleTab';
import { CustomersTab } from './CustomersTab';
import { CommissionRunsTab } from './CommissionRunsTab';
import { ProfileTab } from './ProfileTab';
import { PermissionsTab } from './PermissionsTab';
import { SettingsTab } from './SettingsTab';

interface AdminDashboardProps {
  onViewToggle: () => void;
}

export function AdminDashboard({ onViewToggle }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'salespeople':
        return <SalespeopleTab />;
      case 'customers':
        return <CustomersTab />;
      case 'commission-runs':
        return <CommissionRunsTab />;
      case 'permissions':
        return <PermissionsTab />;
      case 'profile':
        return <ProfileTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <Layout
      user={adminUser}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onViewToggle={onViewToggle}
      isAdminView={true}
    >
      {renderContent()}
    </Layout>
  );
}
