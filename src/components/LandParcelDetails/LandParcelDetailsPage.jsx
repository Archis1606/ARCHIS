import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle2, XCircle, AlertCircle, FileText, Shield, History, Map, ChevronDown, ChevronUp, Scale, Gavel, File, Database, ExternalLink, AlertOctagon, User, Clock, TrendingUp } from 'lucide-react';
import { getLandParcelByPin } from '../../services/landParcelService';
import { formatArea, formatCurrency, formatPercentage, formatDate, formatDateTime } from '../../utils/formatters';
import { calculateCompleteness } from '../../utils/completenessCalculator';

import Header from './Header';
import LandIdentityOwnership from './LandIdentityOwnership';
import LandParcelInformation from './LandParcelInformation';
import ArchesAnalysis from './ArchesAnalysis';
import LegalStatus from './LegalStatus';
import RecordSourcesDocuments from './RecordSourcesDocuments';
import DataCompleteness from './DataCompleteness';
import GeospatialView from './GeospatialView';
import AreaMeasurementTool from './AreaMeasurementTool';
import LandHistoryTimeline from './LandHistoryTimeline';

function LandParcelDetailsPage() {
  const { landPin } = useParams();
  const navigate = useNavigate();

  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [measuredArea, setMeasuredArea] = useState(null);

  // Calculate completeness dynamically
  const completeness = useMemo(() => {
    if (!parcel) return null;
    return calculateCompleteness(parcel);
  }, [parcel]);

  useEffect(() => {
    const fetchParcel = async () => {
      setLoading(true);
      setError(null);

      try {
        // In production, this would be an API call
        // const response = await fetch(`/api/land-parcels/${landPin}`);
        // const data = await response.json();

        // For prototype, use mock service
        const data = getLandParcelByPin(landPin);

        if (data) {
          // Merge calculated completeness
          const calcCompleteness = calculateCompleteness(data);
          setParcel({
            ...data,
            completeness: calcCompleteness
          });
        } else {
          setError('Land parcel not found');
        }
      } catch (err) {
        console.error('Error fetching parcel:', err);
        setError('Failed to load land parcel');
      } finally {
        setLoading(false);
      }
    };

    if (landPin) {
      fetchParcel();
    }
  }, [landPin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading land parcel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center p-8">
          <AlertOctagon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
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

  if (!parcel) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center p-8">
          <AlertOctagon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Land Parcel Not Found</h2>
          <p className="text-zinc-400 mb-6">No land parcel found with PIN: {landPin}</p>
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <MapPin className="w-4 h-4" /> },
    { id: 'ownership', label: 'Ownership', icon: <User className="w-4 h-4" /> },
    { id: 'land-details', label: 'Land Details', icon: <FileText className="w-4 h-4" /> },
    { id: 'analysis', label: 'Arches Analysis', icon: <Shield className="w-4 h-4" /> },
    { id: 'legal', label: 'Legal', icon: <Gavel className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <File className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Ubuntu']">
      {/* Header */}
      <Header
        parcel={parcel}
        onBack={() => navigate('/dashboard')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
        {/* Left Panel - Land Information */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <LandIdentityOwnership parcel={parcel} />
                <LandParcelInformation parcel={parcel} measuredArea={measuredArea} setMeasuredArea={setMeasuredArea} />
                <ArchesAnalysis parcel={parcel} />
                <LegalStatus parcel={parcel} selectedCase={selectedCase} setSelectedCase={setSelectedCase} />
                <RecordSourcesDocuments parcel={parcel} selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />
                <DataCompleteness parcel={parcel} completeness={completeness} />
                <LandHistoryTimeline parcel={parcel} />
              </>
            )}

            {activeTab === 'ownership' && (
              <LandIdentityOwnership parcel={parcel} />
            )}

            {activeTab === 'land-details' && (
              <LandParcelInformation parcel={parcel} measuredArea={measuredArea} setMeasuredArea={setMeasuredArea} />
            )}

            {activeTab === 'analysis' && (
              <ArchesAnalysis parcel={parcel} />
            )}

            {activeTab === 'legal' && (
              <LegalStatus parcel={parcel} selectedCase={selectedCase} setSelectedCase={setSelectedCase} />
            )}

            {activeTab === 'documents' && (
              <RecordSourcesDocuments parcel={parcel} selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />
            )}

            {activeTab === 'history' && (
              <LandHistoryTimeline parcel={parcel} />
            )}
          </div>
        </div>

        {/* Right Panel - Geospatial View */}
        <div className="w-full lg:w-1/3">
          <GeospatialView
            parcel={parcel}
            measuredArea={measuredArea}
            setMeasuredArea={setMeasuredArea}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d0d0d] border border-white/10 p-6 md:p-8 shadow-2xl my-8">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Case ID: {selectedCase.caseId}</span>
              <h3 className="text-xl font-normal text-white mt-1">Legal Case Details</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Case Type</span>
                  <span className="text-sm font-normal text-white">{selectedCase.caseType || 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Case Status</span>
                  <span className={`text-sm font-normal ${getCaseStatusColor(selectedCase.caseStatus)}`}>{selectedCase.caseStatus || 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Court / Authority</span>
                  <span className="text-sm font-normal text-white">{selectedCase.courtAuthority || 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Filing Date</span>
                  <span className="text-sm font-normal text-white">{selectedCase.filingDate ? formatDate(selectedCase.filingDate) : 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Last Updated</span>
                  <span className="text-sm font-normal text-white">{selectedCase.lastUpdated ? formatDate(selectedCase.lastUpdated) : 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Court / Authority</span>
                  <span className="text-sm font-normal text-white">{selectedCase.courtAuthority || 'Not Available'}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Parties Involved</span>
                <p className="text-sm font-normal text-white">{selectedCase.partiesInvolved?.join(', ') || 'Not Available'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Remarks / Summary</span>
                <p className="text-sm font-normal text-white">{selectedCase.remarks || 'Not Available'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d0d0d] border border-white/10 p-6 md:p-8 shadow-2xl my-8">
            <button
              onClick={() => setSelectedDocument(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">{selectedDocument.sourceType}</span>
              <h3 className="text-xl font-normal text-white mt-1">{selectedDocument.documentName}</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Source Type</span>
                  <span className="text-sm font-normal text-white">{selectedDocument.sourceType}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Document ID</span>
                  <span className="text-sm font-mono text-white">{selectedDocument.documentId}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Record Date</span>
                  <span className="text-sm font-normal text-white">{selectedDocument.recordDate ? formatDate(selectedDocument.recordDate) : 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Ingestion Date</span>
                  <span className="text-sm font-normal text-white">{selectedDocument.ingestionDate ? formatDate(selectedDocument.ingestionDate) : 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Source Authority</span>
                  <span className="text-sm font-normal text-white">{selectedDocument.sourceAuthority || 'Not Available'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">Verification Status</span>
                  <span className={`text-sm font-normal ${getVerificationStatusColor(selectedDocument.verificationStatus)}`}>{selectedDocument.verificationStatus}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDocument(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-normal transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getCaseStatusColor(status) {
  switch (status) {
    case 'Active':
      return 'text-yellow-400';
    case 'Closed':
      return 'text-green-400';
    case 'Pending':
      return 'text-blue-400';
    case 'Dismissed':
      return 'text-red-400';
    default:
      return 'text-zinc-400';
  }
}

function getVerificationStatusColor(status) {
  switch (status) {
    case 'Verified':
      return 'text-green-400';
    case 'Pending':
      return 'text-yellow-400';
    case 'Unverified':
      return 'text-red-400';
    default:
      return 'text-zinc-400';
  }
}

export default LandParcelDetailsPage;