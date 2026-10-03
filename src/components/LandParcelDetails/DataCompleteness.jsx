import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Database, AlertTriangle, TrendingUp } from 'lucide-react';
import { getSafeValue } from '../../utils/formatters';

function DataCompleteness({ parcel, completeness }) {
  const comp = completeness || parcel.completeness;

  if (!comp) {
    return (
      <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">Data Completeness</h2>
            <p className="text-xs text-zinc-400">Completeness calculation unavailable</p>
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-8 text-center">
          <Database className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-lg font-normal text-zinc-400 mb-2">Completeness Data Not Available</h3>
          <p className="text-zinc-500">Unable to calculate data completeness for this parcel.</p>
        </div>
      </section>
    );
  }

  const completenessPct = comp.completenessPercentage || 0;
  const getCompletenessColor = (pct) => {
    if (pct >= 90) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (pct >= 75) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    if (pct >= 50) return { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  const colorConfig = getCompletenessColor(completenessPct);

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">Data Completeness</h2>
            <p className="text-xs text-zinc-400">Automatically calculated from available parcel data fields</p>
          </div>
        </div>
        <div className={`
          inline-flex items-center gap-3 px-4 py-3 rounded-xl border
          ${colorConfig.bg} ${colorConfig.border} ${colorConfig.color}
        `}>
        <TrendingUp className={`w-5 h-5 ${colorConfig.color}`} />
        <span className="text-sm font-medium">{completenessPct}% Complete</span>
      </div>
    </div>

    {/* Completeness Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Total Fields</span>
        <p className="text-2xl font-bold text-white">{completeness.totalFields || 0}</p>
      </div>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Available Fields</span>
        <p className="text-2xl font-bold text-green-400">{completeness.availableFields || 0}</p>
      </div>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Missing Fields</span>
        <p className="text-2xl font-bold text-red-400">{completeness.missingFields || 0}</p>
      </div>
    </div>

    {/* Missing Fields List */}
    {completeness.missingFieldNames && completeness.missingFieldNames.length > 0 && (
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-5">
        <h3 className="text-sm font-medium text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Missing Information ({completeness.missingFields})
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          These fields are missing from the land parcel record and should be populated for complete records.
        </p>
        <div className="flex flex-wrap gap-2">
          {completeness.missingFieldNames.map((field, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-mono"
            >
              {field}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Completeness Score Visual */}
    <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/5 p-5">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Completeness Score</h3>
      <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${colorConfig.color.replace('text-', 'bg-')}`}
          style={{ width: `${completenessPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500 mt-2">
        <span>0%</span>
        <span>{completenessPct}%</span>
        <span>100%</span>
      </div>
    </div>
  </section>
  );
}

export default DataCompleteness;