import React, { useState } from 'react';
import { BUILDS_DATA } from '../data';
import { ChevronLeft, ChevronRight, Instagram, ArrowUpRight } from 'lucide-react';

export default function BuildCarousel() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start roughly centered in the gallery
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Performance', 'Tuning', 'Custom', 'Detailing'];

  const filteredBuilds = filter === 'All' 
    ? BUILDS_DATA 
    : BUILDS_DATA.filter(b => b.category === filter);

  // Safely constrain index when filter changes
  const adjustedIndex = Math.min(currentIndex, Math.max(0, filteredBuilds.length - 1));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredBuilds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredBuilds.length) % filteredBuilds.length);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setCurrentIndex(0);
            }}
            className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase border transition-all ${
              filter === cat
                ? 'bg-blood-red border-blood-red text-steel-white shadow-[0_0_10px_rgba(196,30,30,0.3)]'
                : 'bg-carbon-gray/50 border-neutral-900 text-chrome-silver hover:border-neutral-800 hover:text-steel-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D CAROUSEL BOX */}
      {filteredBuilds.length > 0 ? (
        <div className="relative w-full max-w-5xl mx-auto h-[380px] md:h-[420px] flex items-center justify-center overflow-hidden py-10">
          
          <div className="relative w-full h-full flex items-center justify-center">
            {filteredBuilds.map((build, idx) => {
              // Calculate offset relative to current active index
              let offset = idx - adjustedIndex;
              
              // Handle wrapping if we want a circular loop
              const count = filteredBuilds.length;
              if (offset < -count / 2) offset += count;
              if (offset > count / 2) offset -= count;

              const isActive = offset === 0;
              const absOffset = Math.abs(offset);
              
              // Only render items within visual range
              if (absOffset > 2) return null;

              // Compute 3D values
              const translateVal = offset * 260; // Distance
              const rotateVal = offset * -25;    // Tilt back
              const scaleVal = 1 - absOffset * 0.15; // Scale down
              const zIndexVal = 10 - absOffset;      // Depth ordering
              const opacityVal = 1 - absOffset * 0.55; // Fade out

              return (
                <div
                  key={build.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`absolute w-[280px] md:w-[360px] h-[300px] md:h-[350px] transition-all duration-500 ease-out origin-center rounded-xl overflow-hidden border cursor-pointer select-none ${
                    isActive 
                      ? 'border-blood-red shadow-[0_0_25px_rgba(196,30,30,0.4)]' 
                      : 'border-neutral-900 shadow-2xl'
                  }`}
                  style={{
                    transform: `translateX(${translateVal}px) scale(${scaleVal}) rotateY(${rotateVal}deg)`,
                    zIndex: zIndexVal,
                    opacity: opacityVal,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Photo with fallback referrerPolicy */}
                  <img
                    src={build.image}
                    alt={build.carModel}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
                  />

                  {/* Dark Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/30 to-transparent pointer-events-none" />

                  {/* Top Category Badge */}
                  <span className="absolute top-4 left-4 bg-void-black/80 backdrop-blur-md border border-neutral-900 font-mono text-[9px] text-blood-red px-2.5 py-1 rounded-full uppercase tracking-widest font-semibold">
                    {build.category}
                  </span>

                  {/* Bottom Text Panel */}
                  <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-void-black to-void-black/0 flex flex-col gap-1.5 pointer-events-none">
                    <h4 className="font-bebas text-xl md:text-2xl text-steel-white tracking-wider leading-none uppercase">
                      {build.carModel}
                    </h4>
                    <p className="font-sans text-[11px] md:text-xs text-chrome-silver line-clamp-2 leading-relaxed">
                      {build.workDone}
                    </p>
                    
                    {isActive && (
                      <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-blood-red uppercase tracking-wider font-semibold">
                        <span>Tap to zoom build log</span>
                        <ArrowUpRight size={10} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* LEFT / RIGHT TRIGGER NAVIGATION CHEVRONS */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-10 z-20 w-11 h-11 rounded-full bg-carbon-gray border border-neutral-900 text-steel-white flex items-center justify-center hover:border-blood-red hover:text-blood-red transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-10 z-20 w-11 h-11 rounded-full bg-carbon-gray border border-neutral-900 text-steel-white flex items-center justify-center hover:border-blood-red hover:text-blood-red transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>

        </div>
      ) : (
        <div className="w-full h-40 flex items-center justify-center border border-dashed border-neutral-800 rounded">
          <p className="font-mono text-xs text-chrome-silver">No builds matching this category yet.</p>
        </div>
      )}

      {/* FOOTER DIRECT TO INSTAGRAM LINK */}
      <div className="text-center mt-2">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-rajdhani text-sm font-semibold text-chrome-silver hover:text-blood-red transition-colors group border-b border-dashed border-neutral-800 hover:border-blood-red pb-1"
        >
          <Instagram size={14} className="group-hover:rotate-12 transition-transform" />
          <span>Follow fresh daily dyno clips on Instagram @DreamvilleAuto</span>
          <ArrowUpRight size={12} />
        </a>
      </div>

    </div>
  );
}
