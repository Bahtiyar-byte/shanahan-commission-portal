import { useState } from 'react';
import { AdminDashboard } from './pages/admin';
import { SalespersonDashboard } from './pages/salesperson';

function App() {
  const [isAdminView, setIsAdminView] = useState(true);

  const handleViewToggle = () => {
    setIsAdminView(!isAdminView);
  };

  return isAdminView ? (
    <AdminDashboard onViewToggle={handleViewToggle} />
  ) : (
    <SalespersonDashboard onViewToggle={handleViewToggle} />
  );
}

export default App;
