import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, User, Shield, Banknote, Building2, AlertTriangle, 
  Zap, Calendar, FileText, CheckCircle2, XCircle, Info, Landmark, 
  CloudRain, Bug, Waves, Activity, AlertOctagon, Layers
} from 'lucide-react';

export default function LandRecordDetailPage() {
  const { ulpin } = useParams();
  const navigate = useNavigate();

  const [landRecord, setLandRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandRecord = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/land-records/${ulpin}`);
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned a non-JSON response. Check if your backend route is running.");
        }

        const searchData = await response.json();
        console.log("Full API Response Data:", searchData);

        if (searchData.success && searchData.data) {
          setLandRecord(searchData.data);
        } else {
          setLandRecord(null);
          setError(searchData.message || 'Land record not found');
        }
      } catch (err) {
        console.error('Error fetching land record:', err);
        setError(err.message || 'Failed to load land record details');
      } finally {
        setLoading(false);
      }
    };

    if (ulpin) {
      fetchLandRecord();
    }
  }, [ulpin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Ingesting full national land registry dataset...</p>
        </div>
      </div>
    );
  }

  if (error || !landRecord) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Record Extraction Failed</h2>
          <p className="text-zinc-400 mb-6">{error || `No land record found with ULPIN: ${ulpin}`}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs text-zinc-500 font-mono">
          Timestamp UTC: {landRecord?.meta?.timestamp_utc || 'N/A'} | Version: {landRecord?.meta?.standard_version || '1.0'}
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header & Overall Health Banner */}
        <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">Comprehensive Land Record</h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                {landRecord?.meta?.overall_record_health || 'UNKNOWN'}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              ULPIN / Bhu-Aadhaar: <span className="text-emerald-400 font-mono">{landRecord?.identification?.ulpin_bhu_aadhaar || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* 1. Identification & Administrative Units */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Identification & Administrative Units
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-zinc-400 block mb-1">Survey Number</span>
              <span className="font-medium text-white">{landRecord?.identification?.survey_number || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Sub Division / Hissa</span>
              <span className="font-medium text-white">{landRecord?.identification?.sub_division_hissa || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">State</span>
              <span className="font-medium text-white">{landRecord?.identification?.administrative_units?.state || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">District</span>
              <span className="font-medium text-white">{landRecord?.identification?.administrative_units?.district || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Tehsil / Taluk</span>
              <span className="font-medium text-white">{landRecord?.identification?.administrative_units?.tehsil_taluk || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Revenue Circle</span>
              <span className="font-medium text-white">{landRecord?.identification?.administrative_units?.revenue_circle || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Village / Mouza</span>
              <span className="font-medium text-white">{landRecord?.identification?.administrative_units?.village_mouza || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* 2. Spatial & GIS Information */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <Building2 className="w-5 h-5" /> Spatial & GIS Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-zinc-400 block mb-1">Total Area</span>
              <span className="font-medium text-white">{landRecord?.spatial_and_gis?.total_area_sqm ?? 'N/A'} sq.m</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Boundary Type</span>
              <span className="font-medium text-white">{landRecord?.spatial_and_gis?.boundary_type || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Cadastral Map Source</span>
              {landRecord?.spatial_and_gis?.cadastral_map_url ? (
                <a 
                  href={landRecord.spatial_and_gis.cadastral_map_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-400 hover:underline font-medium"
                >
                  View Cadastral Map PDF
                </a>
              ) : (
                <span className="text-zinc-400">N/A</span>
              )}
            </div>
          </div>

          {/* Adjacent Plots */}
          <div className="pt-2">
            <span className="text-zinc-400 block mb-2 text-sm">Adjacent Plot Boundaries</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                <span className="text-zinc-400 block">North</span>
                <span className="font-medium text-white">{landRecord?.spatial_and_gis?.adjacent_plots?.north || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                <span className="text-zinc-400 block">South</span>
                <span className="font-medium text-white">{landRecord?.spatial_and_gis?.adjacent_plots?.south || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                <span className="text-zinc-400 block">East</span>
                <span className="font-medium text-white">{landRecord?.spatial_and_gis?.adjacent_plots?.east || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                <span className="text-zinc-400 block">West</span>
                <span className="font-medium text-white">{landRecord?.spatial_and_gis?.adjacent_plots?.west || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Title, Ownership & Complete History Chain */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <User className="w-5 h-5" /> Title, Ownership & Complete History Chain
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-zinc-400 block mb-1">Document Type</span>
              <span className="font-medium text-white">{landRecord?.title_and_ownership?.document_type || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Land Tenure Class</span>
              <span className="font-medium text-white">{landRecord?.title_and_ownership?.land_tenure_class || 'N/A'}</span>
            </div>
          </div>

          {/* Current Owners */}
          <div className="space-y-2">
            <span className="text-zinc-400 block text-sm font-medium">Current Registered Owners</span>
            {landRecord?.title_and_ownership?.owners?.length > 0 ? (
              landRecord.title_and_ownership.owners.map((owner, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-black/30 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <span className="font-medium text-white text-base">{owner.name}</span>
                    <span className="text-xs text-zinc-400 block">Owner ID: {owner.owner_id} | Share: {owner.share_percentage}%</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${owner.aadhaar_verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>
                    {owner.aadhaar_verified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {owner.aadhaar_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-sm">No owners listed</p>
            )}
          </div>

          {/* Complete Historical Chain */}
          <div className="space-y-2 pt-2">
            <span className="text-zinc-400 block text-sm font-medium">Complete Land History Chain (Chronological)</span>
            {landRecord?.title_and_ownership?.history_chain?.length > 0 ? (
              <div className="space-y-3">
                {landRecord.title_and_ownership.history_chain.map((hist, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-black/40 border border-white/5 text-sm space-y-1 relative pl-6 border-l-2 border-l-emerald-500">
                    <div className="flex justify-between font-medium text-emerald-400">
                      <span>{hist.transaction_type} — {hist.year}</span>
                      <span className="text-xs bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">Mutation: {hist.mutation_number}</span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      Transferred From: <strong className="text-white">{hist.from_party}</strong> $\rightarrow$ Transferred To: <strong className="text-white">{hist.to_party}</strong>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm">No historical chain data recorded</p>
            )}
          </div>
        </div>

        {/* 4. OCR Extraction & Manual Review Queue */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
            <FileText className="w-5 h-5" /> OCR Extraction & Manual Review Status
          </h2>
          <p className="text-xs text-zinc-400">
            Fields below indicate legacy document extractions where automated OCR confidence was low or data was missing, requiring administrative verification.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-black/30 border border-white/5">
              <span className="text-zinc-400 block mb-1">NA Conversion Order Number</span>
              <span className="font-medium text-yellow-400">
                {landRecord?.zoning_and_compliance?.na_conversion_status?.order_number || 'Pending Manual Review (Not Extracted by OCR)'}
              </span>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-white/5">
              <span className="text-zinc-400 block mb-1">Manual Audit Requirement</span>
              <span className="font-medium text-zinc-200">
                {landRecord?.zoning_and_compliance?.na_conversion_status?.is_na_approved ? 'Approved' : 'Required - Non-Agriculture status unverified'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Comprehensive Environmental & Climate Factors */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <CloudRain className="w-5 h-5" /> Environmental & Climate Factors
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-zinc-400 block mb-1">Eco-Sensitive Zone Status</span>
              <span className="font-medium text-white">
                {landRecord?.zoning_and_compliance?.environmental_restrictions?.is_eco_sensitive_zone ? 'Yes (Restricted)' : 'No (Standard Zone)'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Flood Risk Level</span>
              <span className="font-medium text-emerald-400">
                {landRecord?.zoning_and_compliance?.environmental_restrictions?.flood_risk_level || 'Low'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Master Plan Zoning</span>
              <span className="font-medium text-white">{landRecord?.zoning_and_compliance?.master_plan_zone || 'N/A'}</span>
            </div>
          </div>

          {/* Environmental History / Historical Hazards */}
          <div className="pt-2">
            <span className="text-zinc-400 block mb-2 text-sm">Regional Climate & Pest Incident Log</span>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <span className="text-zinc-400 flex items-center gap-1 font-medium"><Waves className="w-3.5 h-3.5 text-blue-400" /> Drought / Water Table</span>
                <span className="text-white font-medium">Normal / Stable Aquifer Recharge</span>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <span className="text-zinc-400 flex items-center gap-1 font-medium"><Bug className="w-3.5 h-3.5 text-yellow-400" /> Pest / Locust Outbreak History</span>
                <span className="text-white font-medium">No severe infestations reported in last 5 cycles</span>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <span className="text-zinc-400 flex items-center gap-1 font-medium"><CloudRain className="w-3.5 h-3.5 text-emerald-400" /> Rainfall / Precipitation</span>
                <span className="text-white font-medium">Average Annual Monsoons (Optimal)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Financial & Encumbrances */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <Banknote className="w-5 h-5" /> Financial & Encumbrances
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm mb-2">
            <div>
              <span className="text-zinc-400 block mb-1">Circle Rate (per sq.m)</span>
              <span className="font-medium text-white">₹{landRecord?.financial_and_encumbrances?.circle_rate_per_sqm_inr?.toLocaleString() || 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1">Property Tax Due</span>
              <span className="font-medium text-white">₹{landRecord?.financial_and_encumbrances?.property_tax_due_inr?.toLocaleString() || '0'}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-zinc-400 block text-sm font-medium">Active Bank Charges / Loans</span>
            {landRecord?.financial_and_encumbrances?.active_bank_charges?.length > 0 ? (
              landRecord.financial_and_encumbrances.active_bank_charges.map((charge, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-black/30 border border-white/5 text-sm space-y-1">
                  <div className="font-medium text-white flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-400" /> {charge.bank_name}
                  </div>
                  <p className="text-xs text-zinc-300">Loan Amount: ₹{charge.loan_amount_inr?.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400">Encumbrance Certificate No: {charge.encumbrance_certificate_number}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-sm">No active bank charges</p>
            )}
          </div>
        </div>

        {/* 7. Litigation & Court Cases */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5" /> Litigation & Court Disputes
          </h2>
          <div className="space-y-2">
            {landRecord?.litigation_and_disputes?.civil_court_cases?.length > 0 ? (
              landRecord.litigation_and_disputes.civil_court_cases.map((cc, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-sm space-y-1">
                  <div className="flex justify-between font-medium text-red-400">
                    <span>{cc.case_number} ({cc.status})</span>
                    <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-300">Active Dispute</span>
                  </div>
                  <p className="text-xs text-zinc-300">Court: {cc.court_name}</p>
                  <p className="text-xs text-zinc-400">Nature of Dispute: {cc.nature_of_dispute}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-sm">No civil court cases reported</p>
            )}
          </div>
        </div>

        {/* 8. AI Anomaly Flags & Risk Analysis */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <Zap className="w-5 h-5" /> AI Anomaly Flags & Risk Analysis
          </h2>
          <div className="space-y-3">
            {landRecord?.ai_anomaly_flags?.length > 0 ? (
              landRecord.ai_anomaly_flags.map((flag, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-lg border-l-4 ${
                    flag.severity === 'HIGH' 
                      ? 'border-red-500 bg-red-500/10' 
                      : 'border-yellow-500 bg-yellow-500/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-white">{flag.category}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      flag.severity === 'HIGH' ? 'text-red-400 bg-red-500/20' : 'text-yellow-400 bg-yellow-500/20'
                    }`}>
                      {flag.severity} SEVERITY
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">{flag.issue}</p>
                  <p className="text-xs text-zinc-400"><strong>Action Required:</strong> {flag.action_required}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-sm">No anomaly flags detected</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}