import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalLandRecords: 0,
    recordsAnalyzed: 0,
    anomaliesDetected: 0,
    casesResolved: 0
  });
  const [anomaliesByState, setAnomaliesByState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard statistics
        const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats');
        const statsData = await statsResponse.json();

        // Fetch anomalies by state
        const anomaliesResponse = await fetch('http://localhost:5000/api/dashboard/anomalies-by-state');
        const anomaliesData = await anomaliesResponse.json();

        if (statsData.success) setStats(statsData.data);
        if (anomaliesData.success) setAnomaliesByState(anomaliesData.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Use mock data as fallback
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

  // Customize bar colors
  const customBarStyle = {
    fill: '#10B981', // Emerald green
    radius: [4, 4, 0, 0]
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(() => (
            <div key={`stat-${Math.random()}`} className="p-4 rounded-lg bg-zinc-900/20 border border-white/5">
              <h3 className="text-sm font-normal text-zinc-400 mb-1">Loading...</h3>
              <p className="text-2xl font-bold text-white">-</p>
            </div>
          ))}
        </div>
        <div className="h-96">
          <div className="flex items-center justify-center h-full text-zinc-400">
            Loading chart...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                formatter={(value) => value}
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px' }}
                labelStyle={{ color: '#fff', fontSize: '14px' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => 'Anomalies Count'}
                wrapperStyle={{ }}
                itemStyle={{
                  fontSize: 12,
                  color: '#zinc-400'
                }}
              >
                <Cell
                  dataKey="count"
                  fill="#10B981"
                />
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
