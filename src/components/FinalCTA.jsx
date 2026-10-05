import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="technology" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center reveal">
        <h2 className="text-3xl md:text-5xl font-normal text-white mb-6 font-['Ubuntu']">
          Building a More Intelligent <br />
          View of Land.
        </h2>
        <p className="text-lg text-zinc-400 font-normal mb-10 max-w-2xl mx-auto">
          ARCHIS connects fragmented records with spatial context to create a clearer foundation for land intelligence.
        </p>
        <button
          onClick={() => scrollToSection('home')}
          className="px-8 py-4 rounded-xl bg-white text-black font-normal text-base inline-flex items-center gap-2 hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 group"
        >
          Explore ARCHIS
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}