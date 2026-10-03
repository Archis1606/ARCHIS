import React from 'react';
import { Clock, History, ArrowUp, ArrowDown, User, FileText, MapPin, Gavel, Shield, AlertTriangle, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const getEventTypeIcon = (type) => {
  switch (type) {
    case 'Initial Survey':
      return <MapPin className="w-4 h-4" />;
    case 'Sale Deed':
      return <FileText className="w-4 h-4" />;
    case 'Land Transfer':
      return <ArrowRight className="w-4 h-4" />;
    case 'Mutation':
      return <ArrowUp className="w-4 h-4" />;
    case 'Spatial Realignment':
      return <MapPin className="w-4 h-4" />;
    case 'Legal Case':
      return <Gavel className="w-4 h-4" />;
    case 'Ownership Change':
      return <User className="w-4 h-4" />;
    case 'GIS Update':
      return <MapPin className="w-4 h-4" />;
    case 'Verification':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'Arches Analysis':
      return <Shield className="w-4 h-4" />;
    default:
      return <History className="w-4 h-4" />;
  }
};

const getEventTypeColor = (type) => {
  switch (type) {
    case 'Initial Survey':
      return 'text-blue-400 bg-blue-500/20';
    case 'Sale Deed':
      return 'text-emerald-400 bg-emerald-500/20';
    case 'Land Transfer':
      return 'text-purple-400 bg-purple-500/20';
    case 'Mutation':
      return 'text-orange-400 bg-orange-500/20';
    case 'Spatial Realignment':
      return 'text-cyan-400 bg-cyan-500/20';
    case 'Legal Case':
      return 'text-red-400 bg-red-500/20';
    case 'Ownership Change':
      return 'text-yellow-400 bg-yellow-500/20';
    case 'GIS Update':
      return 'text-blue-400 bg-blue-500/20';
    case 'Verification':
      return 'text-green-400 bg-green-500/20';
    case 'Arches Analysis':
      return 'text-emerald-400 bg-emerald-500/20';
    default:
      return 'text-zinc-400 bg-zinc-500/20';
  }
};

export default function LandHistoryTimeline({ parcel }) {
  const history = parcel.history || [];

  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <History className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">Land Record History</h2>
            <p className="text-xs text-zinc-400">Chronological record of all events and changes for this parcel</p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
          {history.length} Events
        </span>
      </div>

      {history.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />

          {history.map((event, index) => (
            <div key={index} className="relative pl-20 pb-8 last:pb-0">
              {/* Timeline dot and connector */}
              <div className="absolute left-4 top-1 w-8 h-8 flex items-center justify-center">
                <div className="relative">
                  {/* Connector line */}
                  {index < history.length - 1 && (
                    <div className="absolute left-3 top-10 bottom-0 w-0.5 bg-white/10" />
                  )}
                  {/* Dot */}
                  <div className="relative w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-900 z-10" />
                  {/* Pulse ring for latest event */}
                  {index === 0 && (
                    <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border-2 border-emerald-400/50 animate-ping" />
                  )}
                </div>
              </div>

              {/* Event card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Event type badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `var(--event-bg)`,
                      border: '1px solid var(--event-border)'
                    } as React.CSSProperties}>
                    {getEventTypeIcon(event.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-white">{event.event}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm font-normal text-white">{event.description || 'No description available'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                      </span>
                      {event.user && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{event.user}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )} : (
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-8 text-center">
          <History className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-lg font-normal text-zinc-400 mb-2">No History Records</h3>
          <p className="text-zinc-500">No historical events recorded for this parcel.</p>
        </div>
      )}
    </section>
  );
}

export default LandHistoryTimeline;