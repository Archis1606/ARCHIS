import React from 'react';

export default function HowItWorks() {
  const items = [
    {
      id: '01',
      title: 'CONSOLIDATE',
      desc: 'Bring information from fragmented land records into one structured representation.'
    },
    {
      id: '02',
      title: 'HARMONIZE',
      desc: 'Normalize different formats, terminology and historical records into a consistent data structure.'
    },
    {
      id: '03',
      title: 'CONNECT',
      desc: 'Relate the structured land information with spatial/GIS context.'
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-normal text-white mb-16 text-center font-['Ubuntu'] reveal">
          How ARCHIS Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-emerald-500/20 transition-all duration-500 hover:-translate-y-2 group reveal"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <span className="text-4xl font-normal text-zinc-800 group-hover:text-emerald-500/50 transition-colors duration-500 mb-6 block font-['Ubuntu']">
                {item.id}
              </span>
              <h3 className="text-xl font-normal text-white mb-4 font-['Ubuntu']">
                {item.title}
              </h3>
              <p className="text-zinc-400 font-normal leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
