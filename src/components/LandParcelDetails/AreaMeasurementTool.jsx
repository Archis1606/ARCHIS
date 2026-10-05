import React, { useState } from 'react';
import { Scale, XCircle, History, Trash2 } from 'lucide-react';
import { formatArea, formatDateTime } from '../../utils/formatters';

export default function AreaMeasurementTool({ parcel, measuredArea, setMeasuredArea }) {
  const landDetails = parcel.landDetails || {};
  const recordedArea = landDetails.recordedArea;
  const areaUnit = landDetails.areaUnit || 'Acres';

  const [measurements, setMeasurements] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [measurementHistory, setMeasurementHistory] = useState([]);

  const clearMeasurements = () => {
    setMeasurements([]);
  };

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">Area Measurement Tool</h2>
            <p className="text-xs text-zinc-400">Interactive measurement and comparison tool</p>
          </div>
        </div>
      </div>

      {/* Quick Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Recorded Area</span>
          <p className="text-xl font-bold text-white">{formatArea(parcel.landDetails?.recordedArea, parcel.landDetails?.areaUnit)}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">GIS Area</span>
          <p className="text-xl font-bold text-white">{formatArea(parcel.landDetails?.gisSpatialArea, parcel.landDetails?.areaUnit)}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Difference</span>
          <p className={`text-xl font-bold ${(parcel.landDetails?.areaDiscrepancy || 0) > 0.01 ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatArea(parcel.landDetails?.areaDiscrepancy || 0, parcel.landDetails?.areaUnit)}
          </p>
        </div>
      </div>

      {/* Tool Selection */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTool(activeTool === 'distance' ? null : 'distance')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTool === 'distance'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Scale className="w-4 h-4" />
            <span>Distance</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTool(activeTool === 'area' ? null : 'area')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTool === 'area'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Scale className="w-4 h-4" />
            <span>Area</span>
          </div>
        </button>
      </div>

      {/* Active Tool Instructions */}
      {(activeTool === 'distance' || activeTool === 'area') && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
              {activeTool === 'distance' ? '1' : '2'}
            </span>
            <span className="font-medium text-emerald-400 uppercase tracking-wider">
              {activeTool === 'distance' ? 'Distance Measurement' : 'Area Measurement'}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            Click on the map to place points. {activeTool === 'distance' ? 'Click two points to measure distance.' : 'Click three or more points to measure area.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTool(null)}
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              disabled
            >
              {activeTool === 'distance' ? 'Measure Distance' : 'Measure Area'}
            </button>
          </div>
        </div>
      )}

      {/* Measurement Input */}
      <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5 mb-6">
        <h3 className="text-sm font-medium text-zinc-300 mb-4">Manual Area Entry</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Enter a manually measured area to compare with recorded and GIS data.
        </p>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter measured area"
            value={measuredArea || ''}
            onChange={(e) => setMeasuredArea(e.target.value ? parseFloat(e.target.value) : null)}
            className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
          {measuredArea !== null && (
            <button
              onClick={() => setMeasuredArea(null)}
              className="px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {measuredArea !== null && recordedArea !== undefined && recordedArea !== null && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Recorded</span>
                <p className="font-bold text-white">{formatArea(recordedArea, areaUnit)}</p>
              </div>
              <div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Measured</span>
                <p className="font-bold text-emerald-400">{formatArea(measuredArea, areaUnit)}</p>
              </div>
              <div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Difference</span>
                <p className={`font-bold ${Math.abs(measuredArea - recordedArea) > 0.01 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatArea(Math.abs(measuredArea - recordedArea), areaUnit)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Measurement History */}
      {measurementHistory.length > 0 && (
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            Measurement History
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {measurementHistory.map((record, index) => (
              <div key={index} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${record.type === 'distance' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {record.type === 'distance' ? 'Distance' : 'Area'}
                  </span>
                  <div>
                    <p className="text-sm font-normal text-white">{formatArea(record.value, record.unit)}</p>
                    <p className="text-[11px] text-zinc-500">{formatDateTime(record.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/5">
        <button
          onClick={() => setActiveTool('area')}
          className="flex-1 min-w-[150px] px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium hover:bg-emerald-500/20 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <Scale className="w-4 h-4" />
            <span>Measure Area</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTool('distance')}
          className="flex-1 min-w-[150px] px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium hover:bg-blue-500/20 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <Scale className="w-4 h-4" />
            <span>Measure Distance</span>
          </div>
        </button>
        <button
          onClick={clearMeasurements}
          disabled={measurements.length === 0}
          className="flex-1 min-w-[150px] px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 disabled:opacity-50 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </div>
        </button>
      </div>

      {/* Comparison with User Measurement */}
      {measuredArea !== null && recordedArea !== undefined && recordedArea !== null && (
        <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/5 p-4">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">Comparison Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Recorded</span>
              <p className="text-lg font-bold text-white">{formatArea(recordedArea, areaUnit)}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Measured</span>
              <p className="text-lg font-bold text-emerald-400">{formatArea(measuredArea, areaUnit)}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Difference</span>
              <p className={`text-lg font-bold ${Math.abs(measuredArea - recordedArea) > 0.01 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatArea(Math.abs(measuredArea - recordedArea), areaUnit)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}