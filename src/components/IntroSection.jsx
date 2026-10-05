import React from 'react';

export default function IntroSection() {
  return (
    <section id="about" className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 reveal">
          <div className="flex-1">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-normal tracking-wider uppercase mb-6">
              THE ARCHIS APPROACH
            </div>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-white leading-tight font-['Ubuntu']">
              One Unified View of <br />
              <span className="text-zinc-500">Land Records</span>
            </h2>
          </div>
          <div className="flex-1 max-w-xl">
            <p className="text-lg text-zinc-400 font-normal leading-relaxed">
              Land information is often distributed across different documents and formats, and ARCHIS is designed to bring those records into a common structured representation for spatial analysis. Our platform connects disparate data points, providing a cohesive foundation for intelligent land management.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}