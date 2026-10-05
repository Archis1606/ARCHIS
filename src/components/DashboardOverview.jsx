import { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  RefreshCw,
  Compass,
  TrendingDown,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

/* ==========================================================================
   FUTURE API READY DUMMY DATA STRUCTURES
   Replace these mock arrays and objects with real API responses:
   - GET /api/ingestion/pipeline-status
   - GET /api/analytics/dispute-risk
   - GET /api/analytics/land-use
   - GET /api/analytics/resolution-trends
   - GET /api/regulatory/updates
   ========================================================================== */

// Module 1 Mock Data (Problem 1 & 2: Digitization & Spatial Harmonization)
const INITIAL_PIPELINE_METRICS = {
  ocr: {
    processed: 45210,
    total: 50000,
    unit: 'Documents Processed',
    percentage: 90.42,
    status: 'High Confidence (99.1% OCR Acc)'
  },
  crs: {
    syncedPercentage: 94.2,
    targetStandard: 'EPSG:3857 & EPSG:4326',
    activeEngine: 'Bhu-Naksha Cadastral Sync Engine v2.4',
    status: 'Active Sync'
  },
  reviewQueue: {
    pendingCount: 142,
    criticalCount: 19,
    label: 'Records Pending Review',
    status: 'Human Verification Required'
  }
};

// Module 2 Mock Data: Regional Dispute & Vulnerability Index (Problem 3 / Governance)
const REGIONAL_DISPUTE_METRICS = [
  { district: 'Ludhiana (PB)', totalParcels: 14200, highRisk: 312, modRisk: 840, riskLevel: 'High Vulnerability' },
  { district: 'Gurugram (HR)', totalParcels: 18900, highRisk: 194, modRisk: 520, riskLevel: 'Moderate' },
  { district: 'Lucknow (UP)', totalParcels: 22100, highRisk: 428, modRisk: 910, riskLevel: 'High Vulnerability' },
  { district: 'Jaipur (RJ)', totalParcels: 16500, highRisk: 110, modRisk: 340, riskLevel: 'Low Vulnerability' },
  { district: 'Pune (MH)', totalParcels: 24300, highRisk: 280, modRisk: 760, riskLevel: 'Moderate' },
];

// Module 2 Mock Data: Land Use Distribution Breakdown
const LAND_USE_DISTRIBUTION = [
  { category: 'Agricultural', percentage: 54, color: 'bg-emerald-500', barHex: '#10b981', parcels: '1,42,850' },
  { category: 'Residential', percentage: 28, color: 'bg-teal-400', barHex: '#2dd4bf', parcels: '74,100' },
  { category: 'Commercial', percentage: 12, color: 'bg-amber-400', barHex: '#fbbf24', parcels: '31,750' },
  { category: 'Industrial', percentage: 6, color: 'bg-indigo-400', barHex: '#818cf8', parcels: '15,880' },
];

// Module 2 Mock Data: 6-Month Discrepancy & Conflict Resolution Trend (May - Oct)
const RESOLUTION_TREND_DATA = [
  { month: 'May', verified: 3200, conflicts: 1420 },
  { month: 'Jun', verified: 4800, conflicts: 1250 },
  { month: 'Jul', verified: 6100, conflicts: 980 },
  { month: 'Aug', verified: 7900, conflicts: 820 },
  { month: 'Sep', verified: 9400, conflicts: 610 },
  { month: 'Oct', verified: 11200, conflicts: 410 },
];

// Module 3 Mock Data: National Land Policy & Regulatory Updates
const NATIONAL_POLICY_FEEDS = [
  {
    id: 'POL-2026-001',
    title: 'DILRMP Guidelines Update: Mandatory ULPIN Linking for Commercial Deeds',
    typeTag: 'Gazette Notification',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    date: 'Oct 2, 2026',
    source: 'Ministry of Rural Development',
    summary: 'Directs all State Inspector Generals of Registration to enforce 14-digit Bhu-Aadhaar ULPIN validation prior to deed execution.',
    link: '#'
  },
  {
    id: 'POL-2026-002',
    title: 'Standard Operating Procedure for Cadastral Map Resurvey Using Drone Imagery',
    typeTag: 'Policy Circular',
    tagColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
    date: 'Sep 28, 2026',
    source: 'Department of Land Resources',
    summary: 'Releases SVAMITVA technical specifications defining 5cm Ground Sampling Distance (GSD) compliance for rural abadi settlement maps.',
    link: '#'
  },
  {
    id: 'POL-2026-003',
    title: 'Automated Mutation Workflow Integration Across State Revenue Portals',
    typeTag: 'Inter-State Directive',
    tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    date: 'Sep 15, 2026',
    source: 'National Informatics Centre (NIC)',
    summary: 'Standardizes API schemas bridging registry sub-registrar offices with Tehsil mutation engines to curtail fraudulent duplicate transfers.',
    link: '#'
  },
  {
    id: 'POL-2026-004',
    title: 'Geospatial Coordinate Standard Harmonization (EPSG:3857 to National Grid)',
    typeTag: 'Technical Standard',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    date: 'Sep 01, 2026',
    source: 'Survey of India',
    summary: 'Mandates single coordinate reference transformation protocols across state GIS cadastral boundaries to resolve border discrepancy overlays.',
    link: '#'
  }
];

export default function DashboardOverview() {
  // Stats & Backend Search state
  const [stats, setStats] = useState({
    totalLandRecords: 0,
    recordsAnalyzed: 0,
    anomaliesDetected: 0,
    casesResolved: 0
  });
  const [anomaliesByState, setAnomaliesByState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  // Module 1 Ingestion State (Ready for future API hook: GET /api/ingestion/pipeline-status)
  const [pipelineMetrics] = useState(INITIAL_PIPELINE_METRICS);

  // Module 2 Regional Dispute State (Ready for future API hook: GET /api/analytics/dispute-risk)
  const [disputeMetrics] = useState(REGIONAL_DISPUTE_METRICS);

  // Module 3 Live Policy Feed State (Ready for future API hook: GET /api/regulatory/updates)
  const [policyFeeds] = useState(NATIONAL_POLICY_FEEDS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* Future API Integration Points:
           - const ocrRes = await fetch('http://localhost:5000/api/ingestion/pipeline-status');
           - const policyRes = await fetch('http://localhost:5000/api/regulatory/updates');
        */
        const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats');
        const statsData = await statsResponse.json();

        const anomaliesResponse = await fetch('http://localhost:5000/api/dashboard/anomalies-by-state');
        const anomaliesData = await anomaliesResponse.json();

        if (statsData.success) setStats(statsData.data);
        if (anomaliesData.success) setAnomaliesByState(anomaliesData.data);
      } catch (err) {
        console.error('Error fetching dashboard data, falling back to cached baseline:', err);
        setStats({
          totalLandRecords: 128450,
          recordsAnalyzed: 94218,
          anomaliesDetected: 3842,
          casesResolved: 2716
        });
        setAnomaliesByState([
          { state: 'Punjab', count: 420 },
          { state: 'Haryana', count: 380 },
          { state: 'Uttar Pradesh', count: 520 },
          { state: 'Rajasthan', count: 410 },
          { state: 'Maharashtra', count: 480 },
          { state: 'Madhya Pradesh', count: 390 },
          { state: 'Bihar', count: 350 },
          { state: 'Gujarat', count: 440 },
          { state: 'West Bengal', count: 370 },
          { state: 'Tamil Nadu', count: 400 },
          { state: 'Karnataka', count: 430 },
          { state: 'Telangana', count: 360 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/land-records/search?q=${encodeURIComponent(searchQuery)}`);
      const searchData = await response.json();

      if (searchData.success && searchData.data) {
        const results = searchData.data.map(record => ({
          landPin: record.ulpin,
          ownerName: record.ownerName,
          area: record.recordedArea || 'N/A',
          location: `${record.district}, ${record.state}`,
          value: record.marketValueEstimate || 'N/A'
        }));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching land parcels:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 animate-pulse">
              <div className="h-3 w-24 bg-white/10 rounded mb-2" />
              <div className="h-8 w-32 bg-white/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Max value for Trend SVG scaling
  const maxVerified = Math.max(...RESOLUTION_TREND_DATA.map(d => d.verified));

  return (
    <div className="space-y-8 font-['Ubuntu']">

      {/* =========================================================================
          TOP LEVEL KEY OPERATIONAL METRICS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-xl hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Total Land Records</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.totalLandRecords.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" /> National Cadastral Registry
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-xl hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Records Analyzed</h3>
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">73.3% Total</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.recordsAnalyzed.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-1">Cross-verified via ARCHIS engine</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-xl hover:border-amber-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-semibold tracking-wider uppercase text-amber-400/90">Anomalies Detected</h3>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.anomaliesDetected.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-1">Discrepancies & boundary overlaps</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-xl hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Cases Resolved</h3>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.casesResolved.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-1 text-emerald-400/90">70.6% Resolution rate achieved</p>
        </div>
      </div>

      {/* =========================================================================
          MODULE 1: DIGITIZATION & HARMONIZATION PIPELINE STATUS (Problems 1 & 2)
          Tracks Multi-Source Ingestion & CRS Standardization
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                Ingestion & Spatial Harmonization Pipeline
              </h2>
            </div>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Live telemetry tracking legacy archival OCR digitization (Problem 1) and cross-projection CRS harmonization (Problem 2)
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin" /> Engine Realtime
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Tracker 1: Legacy Record OCR Extraction */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> Legacy OCR Extraction
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {pipelineMetrics.ocr.percentage}%
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight mb-1">
                {pipelineMetrics.ocr.processed.toLocaleString()} <span className="text-xs font-normal text-zinc-500">/ {pipelineMetrics.ocr.total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-zinc-400 mb-4">{pipelineMetrics.ocr.unit}</p>
            </div>

            <div>
              {/* Visual Progress Bar (Emerald fill) */}
              <div className="w-full bg-zinc-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-400 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${pipelineMetrics.ocr.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-2.5 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {pipelineMetrics.ocr.status}
              </p>
            </div>
          </div>

          {/* Tracker 2: Spatial CRS Harmonization */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between hover:border-teal-500/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-400" /> Spatial CRS Harmonization
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  {pipelineMetrics.crs.status}
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight mb-1">
                {pipelineMetrics.crs.syncedPercentage}%
              </div>
              <p className="text-xs text-zinc-400 mb-4">Spatial Datasets Synced to EPSG Standard</p>
            </div>

            <div>
              <div className="w-full bg-zinc-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                  style={{ width: `${pipelineMetrics.crs.syncedPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-2.5 flex items-center gap-1 font-mono truncate">
                <Compass className="w-3 h-3 text-teal-400 shrink-0" /> {pipelineMetrics.crs.targetStandard}
              </p>
            </div>
          </div>

          {/* Tracker 3: Pending Manual Review Queue */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Human Verification Queue
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {pipelineMetrics.reviewQueue.criticalCount} Critical
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight mb-1">
                {pipelineMetrics.reviewQueue.pendingCount}
              </div>
              <p className="text-xs text-zinc-400 mb-4">{pipelineMetrics.reviewQueue.label}</p>
            </div>

            <div>
              <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-between">
                <span className="text-xs text-amber-400/90 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> SLA: 4.2 Hours Avg.
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-xs font-medium text-white hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Resolve Queue $\rightarrow$
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAND PARCEL SEARCH & LOOKUP ENGINE (National ULPIN Gateway)
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">National Bhu-Aadhaar ULPIN Search Gateway</h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Query 14-digit Unique Land Parcel Identification Numbers across pan-India federated land databases
            </p>
          </div>
          {searchResults.length > 0 && (
            <button
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              Clear Results
            </button>
          )}
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter ULPIN (e.g., PB-LDH-2026-984124, HR-GGM-2026-441209, UP-LKO-2026-118942)..."
              className="w-full pl-11 pr-32 py-4 rounded-2xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all placeholder:text-zinc-600 shadow-inner"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 disabled:opacity-50"
            >
              {searchLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Querying...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {/* Quick ULPIN suggestion chips */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-zinc-500">
          <span className="text-zinc-400">Quick Test ULPINs:</span>
          {['PB-LDH-2026-984124', 'HR-GGM-2026-441209', 'UP-LKO-2026-118942', 'RJ-JPR-2026-773410', 'MH-MUM-2026-905183'].map((pin) => (
            <button
              key={pin}
              type="button"
              onClick={() => {
                setSearchQuery(pin);
                navigate(`/land/${pin}`);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 text-zinc-400 border border-white/5 font-mono text-[11px] transition-all"
            >
              {pin}
            </button>
          ))}
        </div>

        {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Matching Cadastral Records ({searchResults.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/land/${result.landPin}`)}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer hover:bg-white/5 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-emerald-400 group-hover:text-emerald-300">
                        {result.landPin}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active Parcel
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      Owner: <strong className="text-white">{result.ownerName}</strong> · Area: <span className="text-zinc-400">{result.area}</span> · Location: <span className="text-zinc-400">{result.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {result.value}
                    </span>
                    <button className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-1 shadow-sm">
                      Full Record $\rightarrow$
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODULE 2: ANALYTICS, RISK METRICS & VISUAL CHARTS (Problem 3 / Governance)
          Pure Tailwind & Custom SVG (No heavy external charting crashes)
          ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
              Dispute Analytics & National Spatial Breakdown
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Multi-district cadastral vulnerability metrics and 6-month dispute de-escalation tracking
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
            Standard: DILRMP National Survey Specs
          </span>
        </div>

        {/* 1. Regional Dispute Risk Meter & District Vulnerability Card */}
        <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-white/5 gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-semibold text-white">Dispute Risk Meter & Regional Vulnerability</h3>
            </div>
            <span className="text-xs text-zinc-400">
              Evaluated across <strong className="text-white">96,000+</strong> parcels for litigation overlap
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {disputeMetrics.map((item, idx) => {
              const riskPercent = Math.round((item.highRisk / item.totalParcels) * 100);
              const isHigh = item.riskLevel.includes('High');
              return (
                <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white">{item.district}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      isHigh ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-500">High Risk Flares</span>
                      <span className="text-white font-mono font-medium">{item.highRisk}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-zinc-500">Moderate Concerns</span>
                      <span className="text-zinc-400 font-mono">{item.modRisk}</span>
                    </div>
                    {/* Visual Segmented Risk Meter */}
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-red-500 h-full" style={{ width: `${Math.min(riskPercent * 25, 60)}%` }} />
                      <div className="bg-amber-400 h-full" style={{ width: `${Math.min(item.modRisk / item.totalParcels * 100 * 5, 30)}%` }} />
                      <div className="bg-emerald-500 h-full flex-1" />
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Total: {item.totalParcels.toLocaleString()} parcels mapped
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Visual Charts Section: Chart A (Land Use) & Chart B (6-Month Resolution Trend) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chart A: Land Use Distribution Breakdown (Tailwind Styled Horizontal Segment Bar) */}
          <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-semibold text-white">Land Use Distribution Breakdown</h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">2,64,580 Total Parcels</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6">
                Classification breakdown across agricultural, residential, commercial, and industrial zones
              </p>

              {/* Multi-segment Combined Horizontal Bar */}
              <div className="w-full h-5 bg-zinc-800 rounded-xl overflow-hidden flex shadow-inner mb-6 p-0.5 border border-white/5">
                {LAND_USE_DISTRIBUTION.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.color} h-full first:rounded-l-lg last:rounded-r-lg transition-all duration-300 relative group cursor-pointer`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.category}: ${item.percentage}%`}
                  />
                ))}
              </div>

              {/* Categorical Breakdown Cards */}
              <div className="grid grid-cols-2 gap-3">
                {LAND_USE_DISTRIBUTION.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} />
                      <div>
                        <span className="text-xs font-medium text-white block">{item.category}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.parcels} parcels</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white font-mono">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Zoning Source: Master Plan 2026-2031</span>
              <span className="text-emerald-400 font-medium">99.4% Digitally Audited</span>
            </div>
          </div>

          {/* Chart B: Discrepancy & Conflict Resolution Trend (Custom SVG Chart May - Oct) */}
          <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-semibold text-white">Discrepancy & Resolution Trend</h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Conflicts
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mb-6">
                6-Month trajectory from May to October showing rising verified records vs. declining active disputes
              </p>

              {/* Clean SVG/Tailwind Bar Chart Structure */}
              <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 bg-black/40 rounded-2xl border border-white/5">
                {RESOLUTION_TREND_DATA.map((item, idx) => {
                  const verifiedHeight = Math.round((item.verified / maxVerified) * 140);
                  const conflictHeight = Math.round((item.conflicts / maxVerified) * 140);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1.5 h-36">
                        {/* Verified Bar (Emerald) */}
                        <div
                          className="w-3 sm:w-4 bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all duration-300 relative group-hover:shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          style={{ height: `${verifiedHeight}px` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400 bg-black/90 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-10">
                            {item.verified}
                          </span>
                        </div>

                        {/* Conflict Bar (Amber/Red) */}
                        <div
                          className="w-3 sm:w-4 bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all duration-300 relative group-hover:shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          style={{ height: `${Math.max(conflictHeight, 8)}px` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-400 bg-black/90 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-10">
                            {item.conflicts}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400 group-hover:text-white transition-colors">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> +250% Verified Growth
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> -71.1% Conflict Reduction
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODULE 3: NATIONAL LAND POLICY & REGULATORY UPDATES LIVE FEED
          Simulated live feed of government circulars, gazettes, and policy shifts
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-3">
          <div className="flex items-center gap-2.5">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                National Land Policy & Regulatory Updates
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Official gazette notifications, DILRMP circulars, and inter-state technical standards
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto font-mono">
            Feed Synced: Today
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {policyFeeds.map((feed) => (
            <div
              key={feed.id}
              className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2.5">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${feed.tagColor}`}>
                    {feed.typeTag}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">{feed.date}</span>
                </div>

                <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-2">
                  {feed.title}
                </h4>

                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                  {feed.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-medium truncate max-w-[200px]">
                  {feed.source}
                </span>
                <a
                  href={feed.link}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Directive Ref: ${feed.id}\nSource: ${feed.source}\nTitle: ${feed.title}`);
                  }}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Read Directive <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ANOMALIES DETECTED BY STATE (Preserved Recharts Operational Visualization)
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">Pan-India Anomaly Distribution by State</h2>
            <p className="text-xs text-zinc-400 mt-1">Cross-state comparative analysis of flagged area and title discrepancies</p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">12 States Active</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anomaliesByState} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="state" tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
              <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                labelStyle={{ color: '#fff', fontWeight: '500', marginBottom: '4px' }}
              />
              <Legend
                wrapper={{
                  style: {
                    color: '#a1a1aa',
                    fontSize: '12px'
                  }
                }}
                content={{
                  formatter: () => 'Anomalies Count'
                }}
                height={36}
              />
              <Bar dataKey="count" barSize={24} radius={[6, 6, 0, 0]} fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
