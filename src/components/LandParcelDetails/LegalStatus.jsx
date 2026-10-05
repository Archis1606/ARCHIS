import React from 'react';
import { Gavel, Shield, AlertTriangle, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { getSafeValue, formatDate } from '../../utils/formatters';

const getCaseStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30';
    case 'Closed':
      return 'text-green-400 bg-green-500/20 border border-green-500/30';
    case 'Pending':
      return 'text-blue-400 bg-blue-500/20 border border-blue-500/30';
    case 'Dismissed':
      return 'text-red-400 bg-red-500/20 border border-red-500/30';
    default:
      return 'text-zinc-400 bg-zinc-500/20 border border-zinc-500/30';
  }
};

const getLegalStatusConfig = (status) => {
  switch (status) {
    case 'Verified':
      return { icon: CheckCircle2, color: 'text-green-400', label: 'Verified' };
    case 'Under Review':
      return { icon: AlertTriangle, color: 'text-yellow-400', label: 'Under Review' };
    case 'Conflict':
      return { icon: XCircle, color: 'text-red-400', label: 'Conflict' };
    case 'Pending':
      return { icon: AlertTriangle, color: 'text-yellow-400', label: 'Pending' };
    default:
      return { icon: AlertTriangle, color: 'text-zinc-400', label: 'Unknown' };
  }
};

export default function LegalStatus({ parcel, selectedCase, setSelectedCase }) {
  const legal = parcel?.legal || {};
  const legalStatusConfig = getLegalStatusConfig(legal.overallStatus);
  const StatusIcon = legalStatusConfig.icon;

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Gavel className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">Legal Status</h2>
            <p className="text-xs text-zinc-400">Legal cases and disputes associated with this parcel</p>
          </div>
        </div>
      </div>

      {/* Overall Legal Status Banner */}
      <div className="mb-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
          <StatusIcon className={`w-5 h-5 ${legalStatusConfig.color}`} />
          <span className="text-sm font-medium">{legalStatusConfig.label}</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Overall Legal Status</span>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${legalStatusConfig.color}`} />
            <span className="font-normal text-white">{legalStatusConfig.label}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Active Cases</span>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{legal.activeCases || 0}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Closed Cases</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-2xl font-bold text-green-400">{legal.closedCases || 0}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Total Cases</span>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <span className="text-2xl font-bold text-white">{legal.cases?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Cases List */}
      {legal.cases && legal.cases.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Case Details</h3>
          {legal.cases.map((caseItem, index) => (
            <div
              key={index}
              onClick={() => setSelectedCase(caseItem)}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-medium text-emerald-400 group-hover:underline">
                      {caseItem.caseId}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${getCaseStatusColor(caseItem.caseStatus)}`}>
                      {caseItem.caseStatus}
                    </span>
                  </div>
                  <p className="text-sm font-normal text-white">{caseItem.caseType || 'Not Available'}</p>
                  <p className="text-xs text-zinc-400 mt-1">{caseItem.courtAuthority || 'Not Available'}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-zinc-400">Filed: {formatDate(caseItem.filingDate)}</p>
                    <p className="text-[11px] text-zinc-500">Updated: {formatDate(caseItem.lastUpdated)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium transition-colors group-hover:bg-emerald-500/20">
                    View Details
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-xs text-zinc-400">
                <p><span className="font-medium text-zinc-300">Parties: </span>{caseItem.partiesInvolved?.join(', ') || 'Not Available'}</p>
                <p><span className="font-medium text-zinc-300">Remarks: </span>{caseItem.remarks || 'Not Available'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-normal text-emerald-400 mb-2">No Active Legal Cases Found</h3>
          <p className="text-zinc-400">This land parcel has no recorded legal cases or disputes.</p>
        </div>
      )}
    </section>
  );
}