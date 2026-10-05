import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import DocumentVerification from './DocumentVerification';
import TodayWork from './TodayWork';
import Anomalies from './Anomalies';
import ArchisAI from './ArchisAI';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('archis_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Ubuntu'] relative flex">
      {/* Sliding Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area - Expands smoothly when sidebar hides */}
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-10 ${
          isSidebarOpen ? 'lg:ml-64 ml-0' : 'ml-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {/* Hamburger button shows ONLY when the sidebar is closed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-white/10 shadow-lg"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-normal tracking-wider text-white">
              Good Morning, Officer
            </h1>
          </div>
        </div>
        <p className="text-lg text-zinc-400 mb-6">
          Land Intelligence Overview <span className="text-xs ml-1">· {new Date().toLocaleDateString()}</span>
        </p>

        {activeSection === 'overview' && <DashboardOverview />}
        {activeSection === 'document-verification' && <DocumentVerification />}
        {activeSection === 'today-work' && <TodayWork />}
        {activeSection === 'anomalies' && <Anomalies />}
        {activeSection === 'archis-ai' && <ArchisAI />}
      </div>
    </div>
  );
}