import React from 'react';
import { FileText, Scale, AlertTriangle } from 'lucide-react';
import { getSafeValue, formatArea, formatCurrency, formatPercentage } from '../../utils/formatters';

export default function LandParcelInformation({ parcel, measuredArea, setMeasuredArea }) {
  const landDetails = parcel.landDetails || {};

  const recordedArea = landDetails.recordedArea;
  const gisArea = landDetails.gisSpatialArea;
  const discrepancy = landDetails.areaDiscrepancy;
  const discrepancyPct = landDetails.areaDiscrepancyPercentage;

  const hasAreaData = recordedArea !== undefined && recordedArea !== null && gisArea !== undefined && gisArea !== null;

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">Land / Parcel Information</h2>
            <p className="text-xs text-zinc-400">Physical and property information for this parcel</p>
          </div>
        </div>
      </div>

      {/* Area Comparison - Highlighted Section */}
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5 mb-6">
        <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Area Comparison
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Recorded Area</span>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-white">{formatArea(landDetails.recordedArea, landDetails.areaUnit)}</span>
              <span className="text-xs text-zinc-400">({landDetails.areaUnit})</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">GIS / Spatial Area</span>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-white">{formatArea(landDetails.gisSpatialArea, landDetails.areaUnit)}</span>
              <span className="text-xs text-zinc-400">({landDetails.areaUnit})</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Discrepancy</span>
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-bold ${hasAreaData && discrepancy !== undefined && discrepancy !== null && discrepancy > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatArea(discrepancy, landDetails.areaUnit)}
              </span>
              <span className="text-xs text-zinc-400">({landDetails.areaUnit})</span>
            </div>
          </div>
        </div>

        {hasAreaData && discrepancy !== undefined && discrepancy !== null && discrepancy > 0 && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm font-normal text-white">
              <span className="font-medium">Discrepancy Percentage: </span>
              <span className="text-red-400 font-bold">{formatPercentage(landDetails.areaDiscrepancyPercentage)}</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Significant difference between recorded and GIS spatial data. Field verification recommended.
            </p>
          </div>
        )}

        {hasAreaData && discrepancy !== undefined && discrepancy !== null && discrepancy === 0 && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm font-normal text-white">
              <span className="font-medium">No discrepancy detected. </span>
              Recorded and GIS spatial data match perfectly.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Land Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Property Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Land Use Type</span>
            <p className="font-normal text-white">{getSafeValue(landDetails.landUseType)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Land Classification</span>
            <p className="font-normal text-white">{getSafeValue(landDetails.landClassification)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Parcel Status</span>
            <p className="font-normal text-white">{getSafeValue(landDetails.parcelStatus || landDetails.landClassification)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Market Value</span>
            <p className="font-normal text-emerald-400 font-medium">{formatCurrency(landDetails.marketValue)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Value per Unit Area</span>
            <p className="font-normal text-white">{formatCurrency(landDetails.valuePerUnitArea)} / {landDetails.areaUnit || 'unit'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Area Unit</span>
            <p className="font-normal text-white">{getSafeValue(landDetails.areaUnit)}</p>
          </div>
        </div>

        {/* Calculated Area Section */}
        {(landDetails.calculatedArea !== undefined && landDetails.calculatedArea !== null) && (
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Calculated Area</span>
                <p className="font-normal text-white">{formatArea(landDetails.calculatedArea, landDetails.areaUnit)}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Measurement Tool */}
        <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/5 p-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-zinc-400" />
            Area Measurement Tool
          </h4>
          <p className="text-xs text-zinc-400 mb-4">
            Enter a manually measured area to compare with recorded and GIS data.
          </p>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Enter measured area"
              className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
              onChange={(e) => setMeasuredArea(e.target.value ? parseFloat(e.target.value) : null)}
            />
            <button
              onClick={() => setMeasuredArea(null)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Clear
            </button>
          </div>

          {measuredArea !== null && recordedArea !== undefined && recordedArea !== null && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Recorded</span>
                  <p className="font-bold text-white">{formatArea(recordedArea, landDetails.areaUnit)}</p>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Measured</span>
                  <p className="font-bold text-emerald-400">{formatArea(measuredArea, landDetails.areaUnit)}</p>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Difference</span>
                  <p className={`font-bold ${Math.abs(measuredArea - recordedArea) > 0.01 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {formatArea(Math.abs(measuredArea - recordedArea), landDetails.areaUnit)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}