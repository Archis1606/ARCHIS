import React from 'react';
import { LayoutDashboard, Upload, Calendar, AlertTriangle, User, LogOut, X, Map, MessageCircle, Brain, Settings } from 'lucide-react';

export default function Sidebar({ activeSection, onSectionChange, onLogout, isOpen, onToggle }) {
  const sections = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'document-verification', label: 'Document Verification', icon: Upload },
    { id: 'today-work', label: "Today's Work", icon: Calendar },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'archis-ai', label: 'ARCHIS AI', icon: MessageCircle }
  ];

  return (
    <>
      {/* Backdrop overlay for mobile/focus when open */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container with GPU-accelerated transform */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-zinc-950/90 backdrop-blur-2xl border-r border-white/10 flex flex-col p-4 z-40 transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Brand Logo & Close Button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
              <Map className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-bold text-lg text-white tracking-wider">ARCHIS</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Land Intelligence</span>
            </div>
          </div>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-1.5 flex-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  // Optional: auto-close sidebar on mobile after clicking
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 min-w-[20px] transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span className="truncate tracking-wide">{section.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile & Logout Actions */}
        <div className="pt-4 mt-auto border-t border-white/5 space-y-1.5">
          <button
            onClick={() => {
              onSectionChange('profile');
              if (window.innerWidth < 1024) onToggle();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors group border border-transparent"
          >
            <User className="w-5 h-5 min-w-[20px] text-zinc-400 group-hover:text-white transition-transform group-hover:scale-110" />
            <span className="truncate">Official Profile</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors group border border-transparent"
          >
            <LogOut className="w-5 h-5 min-w-[20px] text-red-400 group-hover:scale-110 transition-transform" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}