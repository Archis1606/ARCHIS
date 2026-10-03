import React from 'react';
import { LayoutDashboard, Upload, Calendar, AlertTriangle, User, LogOut } from 'lucide-react';

export default function Sidebar({ activeSection, onSectionChange, onLogout }) {
  const sections = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'document-verification', label: 'Document Verification', icon: Upload },
    { id: 'today-work', label: "Today's Work", icon: Calendar },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle }
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-6 space-y-4 z-20">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <img src="/map.svg" alt="ARCHIS Logo" className="w-6 h-6 object-contain filter invert opacity-90" />
        </div>
        <span className="font-semibold text-xl text-white tracking-wider">ARCHIS</span>
      </div>

      <nav className="space-y-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-left text-zinc-400 hover:bg-white/5 hover:text-white transition-colors duration-200 ${
              activeSection === section.id ? 'bg-white/10 text-white' : ''
            }`}
          >
            <section.icon className="w-5 h-5" />
            <span className="font-normal">{section.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          onClick={() => onSectionChange('profile')}
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-left text-zinc-400 hover:bg-white/5 hover:text-white transition-colors duration-200"
        >
          <User className="w-5 h-5" />
          <span className="font-normal">Official Profile</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-left text-zinc-400 hover:bg-white/5 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-normal">Logout</span>
        </button>
      </div>
    </aside>
  );
}