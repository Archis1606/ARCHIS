import React, { useState, useEffect } from 'react';

export default function TodayWork() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    state: '',
    documentType: ''
  });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cases/today');
        const data = await response.json();
        if (data.success) {
          setCases(data.data);
        }
      } catch (err) {
        console.error('Error fetching today\'s cases:', err);
        // Fallback to mock data
        setCases([
          {
            id: 'CASE-001',
            parcelId: 'PARC-2026-001',
            state: 'Punjab',
            district: 'Ludhiana',
            documentType: 'Jamabandi',
            priority: 'High',
            status: 'Pending',
            assignedDate: '2026-10-03',
            action: 'Review'
          },
          {
            id: 'CASE-002',
            parcelId: 'PARC-2026-002',
            state: 'Haryana',
            district: 'Gurugram',
            documentType: 'Record of Rights / RoR',
            priority: 'Medium',
            status: 'In Review',
            assignedDate: '2026-10-03',
            action: 'Review'
          },
          {
            id: 'CASE-003',
            parcelId: 'PARC-2026-003',
            state: 'Uttar Pradesh',
            district: 'Lucknow',
            documentType: 'Sale Deed',
            priority: 'Low',
            status: 'Resolved',
            assignedDate: '2026-10-02',
            action: 'View'
          },
          {
            id: 'CASE-004',
            parcelId: 'PARC-2026-004',
            state: 'Rajasthan',
            district: 'Jaipur',
            documentType: 'Mutation Record',
            priority: 'High',
            status: 'Pending',
            assignedDate: '2026-10-03',
            action: 'Review'
          },
          {
            id: 'CASE-005',
            parcelId: 'PARC-2026-005',
            state: 'Maharashtra',
            district: 'Mumbai',
            documentType: 'Encumbrance Certificate',
            priority: 'Medium',
            status: 'In Review',
            assignedDate: '2026-10-01',
            action: 'View'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Filter cases based on selected filters
  const filteredCases = cases.filter(caseItem => {
    if (filters.status && caseItem.status !== filters.status) return false;
    if (filters.priority && caseItem.priority !== filters.priority) return false;
    if (filters.state && caseItem.state !== filters.state) return false;
    if (filters.documentType && caseItem.documentType !== filters.documentType) return false;
    return true;
  });

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    return [...new Set(cases.map(item => item[field]))].sort();
  };

  const statuses = getUniqueValues('status');
  const priorities = getUniqueValues('priority');
  const states = getUniqueValues('state');
  const documentTypes = getUniqueValues('documentType');

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-normal text-white mb-4">Today's Work</h2>
        <p className="text-zinc-400">Loading today's cases...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/20 border border-white/5 rounded-lg p-6">
        <h2 className="text-xl font-normal text-white mb-4">Today's Work</h2>
        <p className="text-zinc-400 mb-4">
          Assigned workload for the current day. Total cases: {filteredCases.length}
        </p>

        {/* Filters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full pl-3 pr-1 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            >
              <option value="">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
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
            <label className="block text-sm font-medium text-zinc-400 mb-2">Document Type</label>
            <select
              value={filters.documentType}
              onChange={(e) => handleFilterChange('documentType', e.target.value)}
              className="w-full pl-3 pr-1 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
            >
              <option value="">All Types</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cases Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="zinc-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Case ID
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
                  Document Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-zinc-800/20">
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {caseItem.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {caseItem.parcelId}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {caseItem.state}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {caseItem.district}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {caseItem.documentType}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {/* Priority badge */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        caseItem.priority === 'High'
                          ? 'bg-red-500/20 text-red-400'
                          : caseItem.priority === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                      }`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {/* Status badge */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        caseItem.status === 'Pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : caseItem.status === 'In Review'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                      }`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      {new Date(caseItem.assignedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-normal text-white">
                      <button
                        onClick={() => alert(`Action: ${caseItem.action} for case ${caseItem.id}`)}
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        {caseItem.action}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-center text-zinc-400" colSpan="9">
                    No cases found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prototype Notice */}
      <div className="text-xs text-zinc-500 text-center">
        Clearly marked as prototype functionality - not connected to real case management systems
      </div>
    </div>
  );
}
