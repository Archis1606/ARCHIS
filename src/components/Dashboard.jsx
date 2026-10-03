import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import DocumentVerification from './DocumentVerification';
import TodayWork from './TodayWork';
import Anomalies from './Anomalies';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronLeft } from 'lucide-react';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('archis_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Ubuntu'] flex relative overflow-hidden">
      {/* Hamburger Toggle Button - Always visible, adaptive positioning */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOpen(!sidebarOpen);
        }}
        className={`
          fixed top-4 z-[70] p-3 rounded-xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl cursor-pointer
          ${isMobile ? 'left-4' : sidebarOpen ? 'left-[340px]' : 'left-4'}
        `}
        aria-label="Toggle navigation"
        style={{ transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {sidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Component */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Container - offset by sidebar on desktop when open */}
      <div className={`
        flex-1 min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${!isMobile && sidebarOpen ? 'lg:pl-80' : 'lg:pl-0'}
      `}>
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-normal tracking-wider text-white mb-2 font-['Ubuntu']">
              Good Morning, Officer
            </h1>
            <p className="text-sm md:text-base text-zinc-400 font-normal">
              Land Intelligence Overview <span className="text-xs ml-1 text-zinc-500">&bull; {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>

          {/* Render Active View */}
          {activeSection === 'overview' && <DashboardOverview />}
          {activeSection === 'document-verification' && <DocumentVerification />}
          {activeSection === 'today-work' && <TodayWork />}
          {activeSection === 'anomalies' && <Anomalies />}
        </main>
      </div>
    </div>
  );
}