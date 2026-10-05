import React from 'react';
import { User, MapPin, Building, Scale, FileText } from 'lucide-react';
import { getSafeValue } from '../../utils/formatters';

export default function LandIdentityOwnership({ parcel }) {
  const ownership = parcel.ownership || {};
  const location = parcel.location || {};

  const fields = [
    { label: 'Land PIN / Parcel ID', value: parcel.landPin, icon: <MapPin className="w-4 h-4" /> },
    { label: 'Owner Name', value: getSafeValue(ownership.ownerName), icon: <User className="w-4 h-4" /> },
    { label: "Father's Name", value: getSafeValue(ownership.fatherName), icon: <User className="w-4 h-4" /> },
    { label: 'Co-owners', value: ownership.coOwners?.length ? ownership.coOwners.join(', ') : 'None', icon: <User className="w-4 h-4" /> },
    { label: 'Ownership Type', value: getSafeValue(ownership.ownershipType), icon: <Scale className="w-4 h-4" /> },
    { label: 'Ownership Status', value: getSafeValue(ownership.ownershipStatus), icon: <Scale className="w-4 h-4" /> },
    { label: 'State', value: getSafeValue(location.state), icon: <Building className="w-4 h-4" /> },
    { label: 'District', value: getSafeValue(location.district), icon: <Building className="w-4 h-4" /> },
    { label: 'Tehsil', value: getSafeValue(location.tehsil), icon: <Building className="w-4 h-4" /> },
    { label: 'Village', value: getSafeValue(location.village), icon: <MapPin className="w-4 h-4" /> },
    { label: 'Khasra / Survey Number', value: getSafeValue(location.khasraNumber), icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <User className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-normal text-white">Land Identity & Ownership</h2>
          <p className="text-xs text-zinc-400">Core identity and ownership information for this parcel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                {field.icon}
              </div>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {field.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-normal text-white text-sm break-all">
                {field.value}
              </p>
              {field.value === 'Not Available' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                  Missing
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}