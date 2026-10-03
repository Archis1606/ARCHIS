import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import DocumentVerification from './DocumentVerification';
import TodayWork from './TodayWork';
import Anomalies from './Anomalies';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('archis_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Ubuntu']">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <div className="flex-1 p-6 md:p-10">
        <div className="mb-6">
          <h1 className="text-2xl font-normal tracking-wider text-white mb-2">
            Good Morning, Officer
          </h1>
          <p className="text-lg text-zinc-400">
            Land Intelligence Overview <span className="text-xs ml-1">· {new Date().toLocaleDateString()}</span>
          </p>
        </div>

        {activeSection === 'overview' && <DashboardOverview />}
        {activeSection === 'document-verification' && <DocumentVerification />}
        {activeSection === 'today-work' && <TodayWork />}
        {activeSection === 'anomalies' && <Anomalies />}
      </div>
    </div>
  );
}
