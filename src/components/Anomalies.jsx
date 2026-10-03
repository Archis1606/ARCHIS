import React, { useState, useEffect } from 'react';

export default function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    anomalyType: '',
    severity: '',
    status: ''
  });
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(''); // For modal status update feedback

  // Fetch anomalies on mount
  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/anomalies');
        const data = await response.json();
        if (data.success) {
          setAnomalies(data.data);
        }
      } catch (err) {
        console.error('Error fetching anomalies:', err);
        // Fallback to mock data
        setAnomalies([
          {
            id: 'AN-001',
            parcelId: 'PARC-2026-001',
            state: 'Punjab',
            district: 'Ludhiana',
            anomalyType: 'Area Mismatch',
            severity: 'High',
            detectedDate: '2026-10-01',
            status: 'New',
            action: 'Review'
          },
          {
            id: 'AN-002',
            parcelId: 'PARC-2026-002',
            state: 'Haryana',
            district: 'Faridabad',
            anomalyType: 'Ownership Mismatch',
            severity: 'Critical',
            detectedDate: '2026-10-02',
            status: 'Under Review',
            action: 'Review'
          },
          {
            id: 'AN-003',
            parcelId: 'PARC-2026-003',
            state: 'Uttar Pradesh',
            district: 'Kanpur',
            anomalyType: 'Boundary Mismatch',
            severity: 'Medium',
            detectedDate: '2026-10-03',
            status: 'New',
            action: 'Review'
          },
          {
            id: 'AN-004',
            parcelId: 'PARC-2026-004',
            state: 'Rajasthan',
            district: 'Jodhpur',
            anomalyType: 'Duplicate Record',
            severity: 'High',
            detectedDate: '2026-10-02',
            status: 'New',
            action: 'Review'
          },
          {
            id: 'AN-005',
            parcelId: 'PARC-2026-005',
            state: 'Maharashtra',
            district: 'Nagpur',
            anomalyType: 'Missing Record',
            severity: 'Medium',
            detectedDate: '2026-10-03',
            status: 'Under Review',
            action: 'Review'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    return [...new Set(anomalies.map(item => item[field]))].sort();
  };

  const states = getUniqueValues('state');
  const districts = getUniqueValues('district');
  const anomalyTypes = getUniqueValues('anomalyType');
  const severities = getUniqueValues('severity');
  const statuses = getUniqueValues('status');

  // Filter anomalies based on selected filters
  const filteredAnomalies = anomalies.filter(anomaly => {
    if (filters.state && anomaly.state !== filters.state) return false;
    if (filters.district && anomaly.district !== filters.district) return false;
    if (filters.anomalyType && anomaly.anomalyType !== filters.anomalyType) return false;
    if (filters.severity && anomaly.severity !== filters.severity) return false;
    if (filters.status && anomaly.status !== filters.status) return false;
    return true;
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenDetail = (anomaly) => {
    setSelectedAnomaly(anomaly);
    setUpdateStatus('');
  };

  const handleCloseDetail = () => {
    setSelectedAnomaly(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedAnomaly) return;
    try {
      const response = await fetch(`http://localhost:5000/api/anomalies/${selectedAnomaly.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        // Update the anomaly in our state
        setAnomalies(prev => prev.map(a =>
          a.id === selectedAnomaly.id ? { ...a, status: newStatus } : a
        ));
        setSelectedAnomaly(prev => prev ? { ...prev, status: newStatus } : null);
        setUpdateStatus('success');
      } else {
        setUpdateStatus('error');
      }
    } catch (err) {
      console.error('Error updating anomaly status:', err);
      setUpdateStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-normal text-white mb-4">Anomalies</h2>
        <p className="text-zinc-400">Loading anomalies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/20 border border-white/5 rounded-lg p-6">
        <h2 className="text-xl font-normal text-white mb-4">Anomalies</h2>
        <p className="text-zinc-400 mb-4">
          Detected anomalies that require review. Total anomalies: {filteredAnomalies.length}
        </p>

        {/* Filters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">State</label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full pl-3 pr-1 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">District</label>
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="w-full pl-3 pr-1 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Anomaly Type</label>
            <select
              value={filters.anomalyType}
              onChange={(e) => handleFilterChange('anomalyType', e.target.value)}
              className="w-full pl-3 pr-1 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            >
              <option value="">All Types</option>
              {anomalyTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full pl-3 pr-1 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            >
              <option value="">All Severities</option>
              {severities.map(severity => (
                <option key={severity} value={severity}>
                  {severity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full pl-3 pr-1 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Anomalies Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="zinc-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Parcel ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  State
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  District
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Anomaly Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Detected Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {filteredAnomalies.length > 0 ? (
                filteredAnomalies.map((anomaly) => (
                  <tr
                    key={anomaly.id}
                    className="hover:bg-zinc-800/20 cursor-pointer"
                    onClick={() => handleOpenDetail(anomaly)}
                  >
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {anomaly.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {anomaly.parcelId}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {anomaly.state}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {anomaly.district}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {anomaly.anomalyType}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {/* Severity badge */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        anomaly.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400'
                          : anomaly.severity === 'High'
                            ? 'bg-orange-500/20 text-orange-400'
                            : anomaly.severity === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {new Date(anomaly.detectedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {/* Status badge */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        anomaly.status === 'New'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : anomaly.status === 'Under Review'
                            ? 'bg-blue-500/20 text-blue-400'
                            : anomaly.status === 'Resolved'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-zinc-500/20 text-zinc-400'
                      }`}>
                        {anomaly.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering row click
                          handleOpenDetail(anomaly);
                        }}
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        {anomaly.action}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-center text-zinc-400" colSpan="9">
                    No anomalies found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Detail Modal */}
      {selectedAnomaly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative z-50 w-full max-w-md p-4">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-normal text-white">Anomaly #{selectedAnomaly.id}</h2>
                <button
                  onClick={handleCloseDetail}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Parcel ID</p>
                  <p className="text-white font-normal">{selectedAnomaly.parcelId}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">State</p>
                  <p className="text-white font-normal">{selectedAnomaly.state}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">District</p>
                  <p className="text-white font-normal">{selectedAnomaly.district}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Anomaly Type</p>
                  <p className="text-white font-normal">{selectedAnomaly.anomalyType}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Severity</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedAnomaly.severity === 'Critical'
                      ? 'bg-red-500/20 text-red-400'
                      : selectedAnomaly.severity === 'High'
                        ? 'bg-orange-500/20 text-orange-400'
                        : selectedAnomaly.severity === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedAnomaly.severity}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Detected Date</p>
                  <p className="text-white font-normal">{new Date(selectedAnomaly.detectedDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Status</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedAnomaly.status === 'New'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : selectedAnomaly.status === 'Under Review'
                        ? 'bg-blue-500/20 text-blue-400'
                        : selectedAnomaly.status === 'Resolved'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {selectedAnomaly.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <h3 className="text-lg font-normal text-white mb-4">RECORD INFORMATION</h3>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Recorded Area</p>
                  <p className="text-white font-normal">4.82 acres</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Spatial Area</p>
                  <p className="text-white font-normal">4.31 acres</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-400">Difference</p>
                  <p className="text-white font-normal">0.51 acres</p>
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  Potential discrepancy detected
                </p>
              </div>

              {updateStatus && (
                <div className="mt-4 p-3 rounded-lg text-center">
                  {updateStatus === 'success' && (
                    <>
                      <p className="text-emerald-400 font-medium">Status updated successfully!</p>
                    </>
                  )}
                  {updateStatus === 'error' && (
                    <>
                      <p className="text-red-400 font-medium">Failed to update status</p>
                    </>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleStatusUpdate('Under Review')}
                  disabled={updateStatus === 'loading'}
                  className="flex-1 px-4 py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-sm font-normal transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,165,0,0.2)]"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => handleStatusUpdate('Resolved')}
                  disabled={updateStatus === 'loading'}
                  className="flex-1 px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-normal transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,128,0,0.2)]"
                >
                  Resolve Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
