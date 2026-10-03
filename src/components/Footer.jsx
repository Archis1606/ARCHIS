import React from 'react';

export default function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-12 bg-[#050505] border-t border-white/5 text-zinc-500 reveal">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 rounded-md overflow-hidden flex items-center justify-center bg-white/5 border border-white/10">
              <img src="/map.svg" alt="ARCHIS Logo" className="w-4 h-4 object-contain filter invert opacity-80" />
            </div>
            <span className="font-normal text-lg tracking-wider text-white font-['Ubuntu']">ARCHIS</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm font-normal">
            AI-driven Record Consolidation & Harmonization for Integrated Spatial Intelligence
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          {[
            { label: 'Home', id: 'home' },
            { label: 'About', id: 'about' },
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'Technology', id: 'technology' },
          ].map((item) => (
            <a
              key={item.label}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
              className="hover:text-zinc-300 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-600 gap-4">
        <span>&copy; {new Date().getFullYear()} ARCHIS. Concept Landing Page.</span>
        <span>Spatial Intelligence</span>
      </div>
    </footer>
  );
}
