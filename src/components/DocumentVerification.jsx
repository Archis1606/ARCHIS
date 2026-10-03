import React, { useState } from 'react';

export default function DocumentVerification() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [analysisResult, setAnalysisResult] = useState(null);
  const documentInputRef = React.useRef(null);

  // Fetch document types on mount
  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/document-types');
        const data = await response.json();
        if (data.success) {
          setDocumentTypes(data.data);
        }
      } catch (err) {
        console.error('Error fetching document types:', err);
        // Fallback to mock data
        setDocumentTypes([
          'Record of Rights / RoR',
          'Jamabandi',
          'Khatauni',
          'Khasra Record',
          'Mutation Record',
          'Sale Deed',
          'Registry Document',
          'Conveyance Deed',
          'Lease Deed',
          'Gift Deed',
          'Partition Deed',
          'Encumbrance Certificate',
          'Property Tax Record',
          'Municipal Property Record',
          'Cadastral Map',
          'Survey Record',
          'Land Use Record',
          'Other Supporting Document'
        ]);
      }
    };
    fetchTypes();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('size', file.size);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 99));
      }, 100);

      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      const data = await response.json();

      if (data.success) {
        setUploadStatus('success');
        setUploadProgress(100);
      } else {
        setUploadStatus('error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
    }
  };

  const handleAnalysis = async () => {
    if (!file) return;
    setAnalysisStatus('processing');
    try {
      const response = await fetch('http://localhost:5000/api/documents/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          documentType: selectedType
        })
      });
      const data = await response.json();
      if (data.success) {
        setAnalysisStatus('completed');
        setAnalysisResult(data.data);
      } else {
        setAnalysisStatus('error');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/20 border border-white/5 rounded-lg p-6">
        <h2 className="text-xl font-normal text-white mb-4">Document Verification</h2>
        <p className="text-zinc-400 mb-4">
          Upload land documents for AI analysis. Select document type and upload the corresponding file.
        </p>

        {/* Document Type Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Document Type</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search document types..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filtered = documentTypes.filter(type =>
                  type.toLowerCase().includes(searchTerm)
                );
                // We'll just set the first match for simplicity, but in a real app we'd show a dropdown
                if (filtered.length > 0) {
                  setSelectedType(filtered[0]);
                }
              }}
            />
            {/* We'll use a simple select for now, but the requirement was for a clean checkbox/select interface */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {selectedType && (
            <p className="mt-2 text-xs text-zinc-400">Selected: {selectedType}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Upload Document</label>
          <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-400 transition-colors duration-200" onClick={() => documentInputRef.current?.click()}>
            {uploadStatus === 'idle' && (
              <>
                <p className="text-zinc-400">Drag & Drop</p>
                <p className="text-zinc-400">or</p>
                <p className="text-zinc-400">Browse Files</p>
              </>
            )}
            {uploadStatus === 'uploading' && (
              <>
                <p className="text-zinc-400">Uploading...</p>
                <div className="w-full bg-zinc-800/20 rounded-full h-2 mt-2">
                  <div className={`bg-emerald-500 h-2 rounded-full`} style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-sm text-zinc-400 mt-1">{uploadProgress}%</p>
              </>
            )}
            {uploadStatus === 'success' && (
              <>
                <p className="text-emerald-400">Upload Successful</p>
                <p className="text-zinc-400 mt-1">{file?.name}</p>
                <p className="text-xs text-zinc-500">Size: {file ? (file.size / 1024).toFixed(1) + ' KB' : '0 KB'}</p>
              </>
            )}
            {uploadStatus === 'error' && (
              <p className="text-red-400">Upload Failed</p>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {(!file || uploadStatus === 'idle') && (
            <button
              onClick={handleUpload}
              disabled={!selectedType}
              className="flex-1 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-normal transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              Upload File
            </button>
          )}
          {uploadStatus === 'success' && (
            <button
              onClick={handleAnalysis}
              disabled={analysisStatus === 'processing'}
              className="flex-1 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-normal transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {analysisStatus === 'processing' ? (
                <>
                  <span className="mr-2">Analyzing...</span>
                  <span className="animate-spin inline-block w-4 h-4 border-b-2 border-emerald-500 rounded-full"></span>
                </>
              ) : (
                'Submit for Analysis'
              )}
            </button>
          )}
        </div>

        {/* Analysis Status */}
        {analysisStatus !== 'idle' && (
          <div className="mt-6 p-4 rounded-lg bg-zinc-900/20 border border-white/5">
            {analysisStatus === 'processing' && (
              <>
                <p className="text-zinc-400">Document received</p>
                <p className="text-zinc-400">Queued for analysis</p>
                <p className="text-zinc-400">Awaiting AI integration</p>
              </>
            )}
            {analysisStatus === 'completed' && (
              <>
                <p className="text-emerald-400 font-semibold">Prototype analysis completed</p>
                <p className="mt-2 text-zinc-400 text-sm">
                  Note: This is a prototype response. No actual AI analysis was performed.
                </p>
                {analysisResult && (
                  <div className="mt-4 p-3 bg-zinc-800/20 rounded">
                    <p className="text-xs text-zinc-400">Analysis ID: {analysisResult.analysisId}</p>
                    <p className="text-xs text-zinc-400">Status: {analysisResult.status}</p>
                    <p className="text-xs text-zinc-400">Notes: {analysisResult.notes}</p>
                  </div>
                )}
              </>
            )}
            {analysisStatus === 'error' && (
              <p className="text-red-400">Analysis failed</p>
            )}
          </div>
        )}
      </div>

      {/* Prototype Notice */}
      <div className="text-xs text-zinc-500 text-center">
        Clearly marked as prototype functionality - not connected to real AI or document processing systems
      </div>
    </div>
  );
}