import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle, AlertCircle, Target, TrendingUp, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { getSafeValue, formatArea, formatPercentage, formatDate, formatCurrency } from '../../utils/formatters';

export default function ArchesAnalysis({ parcel }) {
  const analysis = parcel.analysis || {};
  const landDetails = parcel.landDetails || {};

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Verified':
        return { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', label: '✓ Verified' };
      case 'Needs Review':
        return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', label: '⚠ Needs Review' };
      case 'Minor Discrepancy':
        return { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', label: '⚠ Minor Discrepancy' };
      case 'Conflict Detected':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: '✕ Conflict Detected' };
      case 'Under Review':
        return { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', label: '⚠ Under Review' };
      default:
        return { icon: AlertTriangle, color: 'text-zinc-400', bg: 'bg-zinc-500/20', border: 'border-zinc-500/30', label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(analysis.status);

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">ARCHIS Parcel Analysis</h2>
            <p className="text-xs text-zinc-400">Automated spatial intelligence analysis results</p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <div className={`
          inline-flex items-center gap-3 px-4 py-3 rounded-xl border
          ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}
        `}>
          <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
          <span className="text-sm font-medium">{statusConfig.label}</span>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Analysis Status</span>
          <div className="flex items-center gap-2">
            <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
            <span className={`font-normal ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Confidence Score</span>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-bold text-white">{getSafeValue(analysis.confidenceScore, 0)}%</span>
            <span className="text-xs text-zinc-400">Confidence</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Last Analysis</span>
          <p className="font-normal text-white">{formatDate(analysis.lastAnalysisDate)}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Recorded Area</span>
          <p className="font-normal text-white">{getSafeValue(landDetails.recordedArea)}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">GIS Area</span>
          <p className="font-normal text-white">{getSafeValue(analysis.gisArea || landDetails.gisSpatialArea)}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Area Discrepancy</span>
          <p className={`font-normal ${analysis.discrepancy && analysis.discrepancy > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {analysis.discrepancy !== undefined && analysis.discrepancy !== null
              ? `${analysis.discrepancy.toFixed(2)} ${parcel.landDetails?.areaUnit || 'Acres'}`
              : 'Not Available'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Discrepancy %</span>
          <p className="font-normal text-white">{formatPercentage(analysis.discrepancyPercentage)}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Boundary Match</span>
          <p className={`font-normal ${analysis.boundaryMatch === 'Match' ? 'text-green-400' : analysis.boundaryMatch === 'Mismatch' ? 'text-red-400' : 'text-yellow-400'}`}>
            {getSafeValue(analysis.boundaryMatch)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Data Completeness</span>
          <p className="font-normal text-white">{parcel.completeness?.completenessPercentage ? `${parcel.completeness.completenessPercentage}%` : 'Not Available'}</p>
        </div>
      </div>

      {/* Issues Detected */}
      {analysis.issuesDetected && analysis.issuesDetected.length > 0 && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-5 mb-6">
          <h3 className="text-sm font-medium text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Issues Detected
          </h3>
          <ul className="space-y-2">
            {analysis.issuesDetected.map((issue, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{issue}</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {(!analysis.issuesDetected || analysis.issuesDetected.length === 0) && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-sm font-normal text-emerald-400">
              No issues detected in the ARCHIS analysis.
            </p>
          </div>
        </div>
      )}

      {/* Area Comparison Detail */}
      <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Area Comparison Detail</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Recorded Area</span>
            <p className="text-lg font-bold text-white">{getSafeValue(parcel.landDetails?.recordedArea, 'N/A')} {parcel.landDetails?.areaUnit || 'Acres'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">GIS Area</span>
            <p className="text-lg font-bold text-white">{getSafeValue(parcel.landDetails?.gisSpatialArea, 'N/A')} {parcel.landDetails?.areaUnit || 'Acres'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Discrepancy</span>
            <p className={`text-lg font-bold ${parcel.analysis?.discrepancy && parcel.analysis.discrepancy > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {parcel.analysis?.discrepancy !== undefined && parcel.analysis.discrepancy !== null
                ? `${parcel.analysis.discrepancy.toFixed(2)} ${parcel.landDetails?.areaUnit || 'Acres'}`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchesAnalysis;