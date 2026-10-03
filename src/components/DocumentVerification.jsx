import React, { useEffect, useRef, useState } from 'react';

const FALLBACK_DOCUMENT_TYPES = [
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
  'Other Supporting Document',
];

export default function DocumentVerification() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [analysisResult, setAnalysisResult] = useState(null);

  const documentInputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/document-types'
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch document types: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setDocumentTypes(data.data);
        } else {
          setDocumentTypes(FALLBACK_DOCUMENT_TYPES);
        }
      } catch (err) {
        console.error('Error fetching document types:', err);
        setDocumentTypes(FALLBACK_DOCUMENT_TYPES);
      }
    };

    fetchTypes();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadStatus('idle');
    setUploadProgress(0);
    setAnalysisStatus('idle');
    setAnalysisResult(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) return;

    setFile(droppedFile);
    setUploadStatus('idle');
    setUploadProgress(0);
    setAnalysisStatus('idle');
    setAnalysisResult(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    if (!selectedType) {
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setAnalysisStatus('idle');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('size', String(file.size));
    formData.append('documentType', selectedType);

    progressIntervalRef.current = setInterval(() => {
      setUploadProgress((previous) => Math.min(previous + 10, 90));
    }, 150);

    try {
      const response = await fetch(
        'http://localhost:5000/api/documents/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      setUploadProgress(100);
      setUploadStatus('success');
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  const handleAnalysis = async () => {
    if (!file || !selectedType) {
      return;
    }

    setAnalysisStatus('processing');
    setAnalysisResult(null);

    try {
      const response = await fetch(
        'http://localhost:5000/api/documents/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            size: file.size,
            documentType: selectedType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Analysis failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Analysis failed');
      }

      setAnalysisStatus('completed');
      setAnalysisResult(data.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisStatus('error');
    }
  };

  const resetFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setAnalysisStatus('idle');
    setAnalysisResult(null);

    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/20 border border-white/5 rounded-lg p-6">
        <h2 className="text-xl font-normal text-white mb-4">
          Document Verification
        </h2>

        <p className="text-zinc-400 mb-4">
          Upload land documents for AI analysis. Select document type and
          upload the corresponding file.
        </p>

        {/* Document Type Selection */}
        <div className="space-y-4">
          <label
            htmlFor="document-type"
            className="block text-sm font-medium text-zinc-400"
          >
            Document Type
          </label>

          <select
            id="document-type"
            value={selectedType}
            onChange={(event) => {
              setSelectedType(event.target.value);
              setAnalysisStatus('idle');
              setAnalysisResult(null);
            }}
            className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="" className="bg-zinc-900">
              Select document type...
            </option>

            {documentTypes.map((type) => (
              <option key={type} value={type} className="bg-zinc-900">
                {type}
              </option>
            ))}
          </select>

          {selectedType && (
            <p className="text-xs text-zinc-400">
              Selected: {selectedType}
            </p>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-4 mt-6">
          <label
            htmlFor="document-file"
            className="block text-sm font-medium text-zinc-400"
          >
            Upload Document
          </label>

          <div
            role="button"
            tabIndex={0}
            onClick={() => documentInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                documentInputRef.current?.click();
              }
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-400 transition-colors duration-200"
          >
            {uploadStatus === 'idle' && (
              <>
                <p className="text-zinc-400">
                  {file ? file.name : 'Drag & Drop'}
                </p>

                {!file && (
                  <>
                    <p className="text-zinc-400">or</p>
                    <p className="text-zinc-400">Browse Files</p>
                  </>
                )}

                {file && (
                  <p className="text-xs text-zinc-500 mt-2">
                    Click to choose a different file
                  </p>
                )}
              </>
            )}

            {uploadStatus === 'uploading' && (
              <>
                <p className="text-zinc-400">Uploading...</p>

                <div className="w-full bg-zinc-800/20 rounded-full h-2 mt-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <p className="text-sm text-zinc-400 mt-1">
                  {uploadProgress}%
                </p>
              </>
            )}

            {uploadStatus === 'success' && (
              <>
                <p className="text-emerald-400">Upload Successful</p>

                <p className="text-zinc-400 mt-1">
                  {file?.name}
                </p>

                <p className="text-xs text-zinc-500">
                  Size:{' '}
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : '0 KB'}
                </p>
              </>
            )}

            {uploadStatus === 'error' && (
              <>
                <p className="text-red-400">Upload Failed</p>

                <p className="text-xs text-zinc-500 mt-1">
                  Click here to select the file again.
                </p>
              </>
            )}
          </div>

          <input
            ref={documentInputRef}
            id="document-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx"
          />

          {file && uploadStatus !== 'uploading' && (
            <button
              type="button"
              onClick={resetFile}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Remove selected file
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {uploadStatus !== 'success' && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || !selectedType || uploadStatus === 'uploading'}
              className="flex-1 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-500/30 text-sm font-normal transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {uploadStatus === 'uploading'
                ? 'Uploading...'
                : 'Upload File'}
            </button>
          )}

          {uploadStatus === 'success' && (
            <button
              type="button"
              onClick={handleAnalysis}
              disabled={analysisStatus === 'processing'}
              className="flex-1 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-500/30 text-sm font-normal transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {analysisStatus === 'processing' ? (
                <>
                  <span className="mr-2">Analyzing...</span>
                  <span className="animate-spin inline-block w-4 h-4 border-b-2 border-emerald-500 rounded-full" />
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
                <p className="text-zinc-400">
                  Awaiting AI integration
                </p>
              </>
            )}

            {analysisStatus === 'completed' && (
              <>
                <p className="text-emerald-400 font-semibold">
                  Prototype analysis completed
                </p>

                <p className="mt-2 text-zinc-400 text-sm">
                  Note: This is a prototype response. No actual AI analysis
                  was performed.
                </p>

                {analysisResult && (
                  <div className="mt-4 p-3 bg-zinc-800/20 rounded">
                    <p className="text-xs text-zinc-400">
                      Analysis ID: {analysisResult.analysisId ?? 'N/A'}
                    </p>

                    <p className="text-xs text-zinc-400">
                      Status: {analysisResult.status ?? 'N/A'}
                    </p>

                    <p className="text-xs text-zinc-400">
                      Notes: {analysisResult.notes ?? 'N/A'}
                    </p>
                  </div>
                )}
              </>
            )}

            {analysisStatus === 'error' && (
              <p className="text-red-400">
                Analysis failed. Please try again.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Prototype Notice */}
      <div className="text-xs text-zinc-500 text-center">
        Clearly marked as prototype functionality - not connected to real AI
        or document processing systems
      </div>
    </div>
  );
}
