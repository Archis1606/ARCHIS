import React from 'react';
import { FileText, Database, Map } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    { icon: FileText, label: 'LAND DOCUMENTS' },
    { icon: Database, label: 'RECORD CONSOLIDATION' },
    { icon: Map, label: 'SPATIAL INTELLIGENCE' },
  ];

  return (
    <section className="py-20 bg-[#0c0c0c] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 reveal">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-4 group">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                  <step.icon className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-500" />
                </div>
                <span className="text-xs font-normal tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors duration-500 font-['Ubuntu']">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:flex flex-1 items-center justify-center -mt-8">
                  <div className="w-full h-[1px] bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 mx-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
