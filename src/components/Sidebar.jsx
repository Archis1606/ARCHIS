import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Upload, Calendar, AlertTriangle, User, LogOut, Menu, X } from 'lucide-react';

export default function Sidebar({ activeSection, onSectionChange, onLogout, isOpen, setIsOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (sectionId) => {
    onSectionChange(sectionId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sections = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'document-verification', label: 'Document Verification', icon: Upload },
    { id: 'today-work', label: "Today's Work", icon: Calendar },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle }
  ];

  return (
    <>
      {/* Dimmed Backdrop - ONLY on mobile when sidebar is open */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 md:w-80 z-50 transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'rgba(12, 12, 12, 0.75)',
          backdropFilter: 'blur(30px) saturate(190%)',
          WebkitBackdropFilter: 'blur(30px) saturate(190%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          {/* Header with Logo & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.15)',
                }}
              >
                <img src="/map.svg" alt="ARCHIS Logo" className="w-6 h-6 object-contain filter invert opacity-90" />
              </div>
              <div>
                <span className="font-semibold text-lg text-white tracking-wider block">ARCHIS</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block -mt-1 font-mono">Official Hub</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 flex-1">
            <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className={`
                  w-full flex items-center space-x-3 rounded-2xl px-3.5 py-3 text-left
                  font-normal transition-all duration-200 group
                  ${activeSection === section.id
                    ? 'text-white bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                    ${activeSection === section.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-zinc-200'
                    }
                  `}
                >
                  <section.icon className="w-4 h-4" />
                </div>
                <span className="font-normal text-sm tracking-wide">{section.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Profile and Logout Actions */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <button
              onClick={() => handleNavClick('profile')}
              className="w-full flex items-center space-x-3 rounded-2xl px-3.5 py-2.5 text-left text-zinc-400 font-normal hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <span className="font-normal text-xs">Official Profile</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 rounded-2xl px-3.5 py-2.5 text-left text-zinc-400 font-normal hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-red-400">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-normal text-xs">Logout</span>
            </button>

            <div className="pt-2 text-center">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                ARCHIS &bull; SECURE CONSOLE
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}