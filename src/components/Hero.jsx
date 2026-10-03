import React, { useEffect, useState } from 'react';
import { ArrowRight, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-24"
    >
      {/* Background Land Image with Premium Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/bg.jpeg"
          alt="Land Background"
          className="w-full h-full object-cover object-center scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
        />
        {/* Cinematic dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(10,10,10,0.8)_80%)]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col lg:flex-row items-center gap-16 py-12 md:py-20">
        {/* Left Side: Headline & Copy */}
        <div
          className={`flex-1 flex flex-col items-start transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-normal tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-POWERED LAND INTELLIGENCE
          </div>

          {/* Main Heading: Full form of ARCHIS */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-6 leading-[1.2] max-w-2xl font-['Ubuntu']">
            AI-driven Record Consolidation & Harmonization for Integrated Spatial Intelligence
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-base md:text-lg text-zinc-400 font-normal leading-relaxed mb-10 max-w-xl">
            ARCHIS brings fragmented land records together, harmonizes information across documents, and creates a unified foundation for intelligent spatial analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('about')}
              className="px-8 py-4 rounded-xl bg-white text-black font-normal text-base flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 group"
            >
              Explore ARCHIS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 text-white font-normal text-base border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md active:scale-95"
            >
              How It Works
            </button>
          </div>
        </div>

        {/* Right Side: Subtle Interface Presence (Depth Elements) */}
        <div
          className={`flex-1 w-full max-w-lg lg:max-w-none flex justify-center items-center transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="relative w-full max-w-[480px] aspect-square rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.01] p-8 backdrop-blur-md overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Subtle glow grid behind */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] opacity-30" />

            {/* Glowing active scanner line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent animate-[scan_6s_infinite_linear]" />

            {/* Logo Map graphic background */}
            <div className="absolute inset-6 flex items-center justify-center opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-700 select-none pointer-events-none">
              <img src="/map.svg" alt="Map Overlay" className="w-full h-full object-contain filter invert" />
            </div>

            {/* Interface Content - Abstract Document / GIS alignment illustration */}
            <div className="relative h-full flex flex-col justify-between z-10">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-normal uppercase tracking-widest text-zinc-400">Harmonization Engine</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">v0.13.3-active</span>
              </div>

              {/* Middle Alignment Visual */}
              <div className="my-auto py-6 flex flex-col gap-5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/10">
                      <span className="text-xs font-mono text-zinc-400">DOC</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-normal text-white">Registry Record</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">ID: 48A-92/2026</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Parsed</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/10">
                      <Layers className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-normal text-white">Spatial Geometry</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">EPSG:4326 WGS84</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Aligned</span>
                  </div>
                </div>
              </div>

              {/* Footer status bar */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[11px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Records consolidated</span>
                </div>
                <span className="font-mono text-emerald-400">1:1 Linked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Hero Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />
    </section>
  );
}
