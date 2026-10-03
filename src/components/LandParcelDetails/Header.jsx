import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle2, XCircle, AlertCircle, ChevronLeft } from 'lucide-react';

export default function Header({ parcel, onBack, activeTab, setActiveTab, tabs }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Verified':
        return { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
      case 'Needs Review':
        return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
      case 'Minor Discrepancy':
        return { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
      case 'Conflict Detected':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
      case 'Under Review':
        return { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
      default:
        return { icon: AlertTriangle, color: 'text-zinc-400', bg: 'bg-zinc-500/20', border: 'border-zinc-500/30' };
    }
  };

  const statusConfig = getStatusConfig(parcel.analysis?.status);

  return (
    <header className="bg-zinc-900/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
          {/* Left side - Brand and Back */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Back to dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-white tracking-wider">ARCHIS</h1>
                <span className="text-xs text-zinc-400 uppercase tracking-widest">Land Parcel Details</span>
              </div>
            </div>
          </div>

          {/* Center - Land PIN and Status */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:mx-auto">
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
                  LAND PIN
                </span>
                <span className="font-mono text-lg font-medium text-white">
                  {parcel.landPin}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
              <div className={`
                px-3 py-1.5 rounded-xl border text-sm font-medium ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}
              `}>
                {parcel.analysis?.status || 'Unknown'}
              </div>
            </div>
          </div>

          {/* Right - Tab indicators */}
          <div className="hidden lg:flex items-center gap-1 bg-zinc-800/50 rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 border-t border-white/5 pt-4" aria-label="Breadcrumb">
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to="/dashboard" className="hover:text-white transition-colors">Land Search</Link>
          <span>/</span>
          <Link to={`/land/${parcel.landPin}`} className="hover:text-white transition-colors">Land Parcel</Link>
          <span>/</span>
          <span className="text-zinc-400 font-medium">More Information</span>
        </nav>
      </div>
    </header>
  );
}

export default Header;