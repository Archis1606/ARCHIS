import React from 'react';
import { FileText, Database, FileCheck, ExternalLink, Shield, Clock, MapPin, Gavel } from 'lucide-react';
import { getSafeValue, formatDate } from '../../utils/formatters';

const getSourceTypeIcon = (type) => {
  switch (type) {
    case 'Revenue Record':
      return <FileText className="w-4 h-4" />;
    case 'Cadastral Record':
      return <FileText className="w-4 h-4" />;
    case 'Survey Record':
      return <Database className="w-4 h-4" />;
    case 'GIS Data':
      return <MapPin className="w-4 h-4" />;
    case 'Registration Record':
      return <FileCheck className="w-4 h-4" />;
    case 'Legal Record':
      return <Gavel className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getVerificationStatusConfig = (status) => {
  switch (status) {
    case 'Verified':
      return { icon: FileCheck, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    case 'Pending':
      return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    case 'Unverified':
      return { icon: Shield, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
    default:
      return { icon: Shield, color: 'text-zinc-400', bg: 'bg-zinc-500/20', border: 'border-zinc-500/30' };
  }
};

export default function RecordSourcesDocuments({ parcel, selectedDocument, setSelectedDocument }) {
  const sources = parcel?.sources || [];

  return (
    <section className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-normal text-white">Record Sources & Documents</h2>
            <p className="text-xs text-zinc-400">Source records and supporting documents for this parcel</p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
          {sources.length} Source(s)
        </span>
      </div>

      {sources.length > 0 ? (
        <div className="space-y-3">
          {sources.map((source, index) => {
            const verificationConfig = getVerificationStatusConfig(source.verificationStatus);
            const StatusIcon = verificationConfig.icon;

            return (
              <div
                key={index}
                onClick={() => setSelectedDocument(source)}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                        {getSourceTypeIcon(source.sourceType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                            {source.documentName || source.sourceType}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5 font-mono">
                            {source.sourceType}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{source.sourceName || 'Not Available'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium
                      ${verificationConfig.bg}
                      ${verificationConfig.border}
                      ${verificationConfig.color}
                    `}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{source.verificationStatus}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium transition-colors group-hover:bg-emerald-500/20">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                  <p><span className="font-medium text-zinc-300">Document ID: </span>{getSafeValue(source.documentId)}</p>
                  <p><span className="font-medium text-zinc-300">Record Date: </span>{formatDate(source.recordDate)}</p>
                  <p><span className="font-medium text-zinc-300">Ingestion Date: </span>{formatDate(source.ingestionDate)}</p>
                  <p><span className="font-medium text-zinc-300">Authority: </span>{getSafeValue(source.sourceAuthority)}</p>
                  <p><span className="font-medium text-zinc-300">Verification: </span>{source.verificationStatus}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-8 text-center">
          <FileText className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-lg font-normal text-zinc-400 mb-2">No Source Records Found</h3>
          <p className="text-zinc-500">No source documents or records are available for this parcel.</p>
        </div>
      )}
    </section>
  );
}