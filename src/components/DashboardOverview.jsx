import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Search, MapPin, User, FileText, AlertCircle, CheckCircle2, ShieldAlert, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLandParcelByPin } from '../../services/landParcelService';

function DashboardOverview() {
  const [stats, setStats] = useState({
    totalLandRecords: 0,
    recordsAnalyzed: 0,
    anomaliesDetected: 0,
    casesResolved: 0
  });
  const [anomaliesByState, setAnomaliesByState] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats');
        const statsData = await statsResponse.json();

        const anomaliesResponse = await fetch('http://localhost:5000/api/dashboard/anomalies-by-state');
        const anomaliesData = await anomaliesResponse.json();

        if (statsData.success) setStats(statsData.data);
        if (anomaliesData.success) setAnomaliesByState(anomaliesData.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
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

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/land-records/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewRecord = (ulpin) => {
    navigate(`/land/${ulpin}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-zinc-900/20 border border-white/5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-['Ubuntu']">
      {/* ULPIN Search Bar Section */}
      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-xl">
        <div className="max-w-3xl mb-4">
          <h2 className="text-xl font-normal text-white mb-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            Land Parcel ULPIN Search
          </h2>
          <p className="text-xs text-zinc-400">
            Search land records by Unique Land Parcel Identification Number (ULPIN), Parcel ID, Owner Name, or District.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. PB-LDH-2026-984124, HR-GGM-2026-441209, or Owner Name..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-medium text-sm hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search Record'}
          </button>
        </form>

        {/* Sample ULPINs for quick testing */}
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <span>Try ULPINs:</span>
          <button
            type="button"
            onClick={() => { setSearchQuery('PB-LDH-2026-984124'); }}
            className="text-emerald-400/80 hover:text-emerald-400 hover:underline font-mono"
          >
            PB-LDH-2026-984124
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => { setSearchQuery('HR-GGM-2026-441209'); }}
            className="text-emerald-400/80 hover:text-emerald-400 hover:underline font-mono"
          >
            HR-GGM-2026-441209
          </button>
        </div>

        {/* Search Results Dropdown/List */}
        {searchResults.length > 0 && (
          <div className="mt-6 border-t border-white/5 pt-4">
            <h3 className="text-xs font-normal text-zinc-400 uppercase tracking-wider mb-3">
              Search Results ({searchResults.length})
            </h3>
            <div className="grid gap-3">
              {searchResults.map((record) => (
                <div
                  key={record.ulpin}
                  onClick={() => handleViewRecord(record.ulpin)}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-emerald-400 group-hover:underline">
                          {record.ulpin}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                          {record.parcelId}
                        </span>
                      </div>
                      <p className="text-sm font-normal text-white mt-0.5">{record.ownerName}</p>
                      <p className="text-xs text-zinc-500">{record.village}, {record.tehsil}, {record.district}, {record.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-zinc-400">Area: <span className="text-white">{record.recordedArea}</span></p>
                      <p className="text-[11px] text-zinc-500">{record.landType}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-normal transition-all group-hover:bg-emerald-500/20">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-zinc-900/20 border border-white/5">
          <h3 className="text-sm font-normal text-zinc-400 mb-1">TOTAL LAND RECORDS</h3>
          <p className="text-2xl font-bold text-white">{stats.totalLandRecords.toLocaleString()}</p>
          <p className="text-xs text-zinc-400 mt-1">Total records available</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/20 border border-white/5">
          <h3 className="text-sm font-normal text-zinc-400 mb-1">RECORDS ANALYZED</h3>
          <p className="text-2xl font-bold text-white">{stats.recordsAnalyzed.toLocaleString()}</p>
          <p className="text-xs text-zinc-400 mt-1">Records analyzed by ARCHIS</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/20 border border-white/5">
          <h3 className="text-sm font-normal text-zinc-400 mb-1">ANOMALIES DETECTED</h3>
          <p className="text-2xl font-bold text-white">{stats.anomaliesDetected.toLocaleString()}</p>
          <p className="text-xs text-zinc-400 mt-1">Potential inconsistencies identified</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/20 border border-white/5">
          <h3 className="text-sm font-normal text-zinc-400 mb-1">CASES RESOLVED</h3>
          <p className="text-2xl font-bold text-white">{stats.casesResolved.toLocaleString()}</p>
          <p className="text-xs text-zinc-400 mt-1">Cases reviewed and resolved</p>
        </div>
      </div>

      {/* Anomalies by State Chart */}
      <div className="rounded-lg bg-zinc-900/20 border border-white/5 p-6">
        <h2 className="text-xl font-normal text-white mb-6">Anomalies Detected by State</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={anomaliesByState}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="state" tickLine={false} tick={{ fontSize: 12, fill: '#zinc-400' }} />
              <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#zinc-400' }} domain={['dataMax', 0]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px' }}
                labelStyle={{ color: '#fff', fontSize: '14px' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={() => 'Anomalies Count'}
                itemStyle={{
                  fontSize: 12,
                  color: '#zinc-400'
                }}
              >
                <Cell dataKey="count" fill="#10B981" />
              </Legend>
              <Bar dataKey="count" barSize={24} radius={[4, 4, 0, 0]} fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-zinc-500 text-center">
          Clearly marked as prototype data - not representing actual government statistics
        </p>
      </div>
    </div>
  );
}

export default DashboardOverview;