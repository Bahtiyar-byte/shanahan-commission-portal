import { useState } from 'react';
import { Layout } from '../../components/layout';
import { salespersonUser } from '../../data/mockData';
import { MyDashboardTab } from './MyDashboardTab';
import { MyLoadsTab } from './MyLoadsTab';
import { MyCustomersTab } from './MyCustomersTab';
import { MyHistoryTab } from './MyHistoryTab';
import { ProfileTab } from './ProfileTab';
import { SettingsTab } from './SettingsTab';

interface SalespersonDashboardProps {
  onViewToggle: () => void;
}

export function SalespersonDashboard({ onViewToggle }: SalespersonDashboardProps) {
  const [activeTab, setActiveTab] = useState('my-dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'my-dashboard':
        return <MyDashboardTab />;
      case 'my-loads':
        return <MyLoadsTab />;
      case 'my-customers':
        return <MyCustomersTab />;
      case 'my-history':
        return <MyHistoryTab />;
      case 'profile':
        return <ProfileTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <MyDashboardTab />;
    }
  };

  return (
    <Layout
      user={salespersonUser}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onViewToggle={onViewToggle}
      isAdminView={false}
    >
      {renderContent()}
    </Layout>
  );
}
