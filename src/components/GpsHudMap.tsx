import React, { useState } from 'react';
import { Target, MapPin, Navigation, Compass, Layers } from 'lucide-react';

export default function GpsHudMap() {
  const [activePin, setActivePin] = useState('shop');
  const [mapScale, setMapScale] = useState(1);

  const locations = [
    {
      id: 'shop',
      name: 'Dreamville Auto (HQ)',
      desc: '6432 Beresford St, Burnaby',
      coords: '49.2198° N, 122.9796° W',
      type: 'hq',
      x: 50, // % in SVG viewport
      y: 50,
    },
    {
      id: 'metrotown',
      name: 'Metrotown Mall Interchange',
      desc: '5-min test drive route loop',
      coords: '49.2276° N, 122.9984° W',
      type: 'poi',
      x: 32,
      y: 38,
    },
    {
      id: 'highway',
      name: 'BC Highway-1 Connector',
      desc: 'High speed acceleration logs',
      coords: '49.2530° N, 122.9722° W',
      type: 'poi',
      x: 68,
      y: 20,
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[350px] flex flex-col border border-neutral-900 rounded-none bg-neutral-950 overflow-hidden box-glow-red">
      
      {/* GPS Header HUD strip */}
      <div className="bg-[#0b0b0b] border-b border-neutral-900 p-3.5 flex items-center justify-between font-mono text-xs text-chrome-silver">
        <div className="flex items-center gap-2">
          <Compass size={12} className="text-blood-red animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-bold tracking-widest text-blood-red">GPS FEED — LIVE RADAR</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-neutral-600">SCALE: {(mapScale * 100).toFixed(0)}%</span>
          <span className="text-blood-red font-semibold animate-pulse">GRID ONLINE</span>
        </div>
      </div>

      {/* Map grid content */}
      <div className="relative flex-1 bg-[#050505] overflow-hidden flex items-center justify-center p-4">
        
        {/* Futuristic Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #c41e1e 1px, transparent 1px),
              linear-gradient(to bottom, #c41e1e 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: 'center center'
          }}
        />

        {/* Dynamic Sweep Radar Light */}
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blood-red/10 bg-radial-gradient from-blood-red/5 via-transparent to-transparent pointer-events-none animate-ping" style={{ animationDuration: '4s' }} />

        {/* SVG Drawing Routes & Concentric Circles */}
        <svg 
          className="absolute inset-0 w-full h-full text-neutral-800 transition-transform duration-500 ease-out"
          style={{ transform: `scale(${mapScale})` }}
        >
          {/* Dynamic HUD Circular Rings */}
          <circle cx="50%" cy="50%" r="80" fill="none" stroke="#c41e1e" strokeWidth="1" strokeDasharray="5,10" className="opacity-20" />
          <circle cx="50%" cy="50%" r="160" fill="none" stroke="#c41e1e" strokeWidth="1" strokeDasharray="3,15" className="opacity-10" />

          {/* Test Drive Route (Vector Path Lines) */}
          <path 
            d="M 32% 38% L 50% 50% L 68% 20%" 
            fill="none" 
            stroke="#c41e1e" 
            strokeWidth="1.5" 
            strokeDasharray="4,6" 
            className="opacity-40"
          />
        </svg>

        {/* Render Markers */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ transform: `scale(${mapScale})` }}
        >
          {locations.map((loc) => {
            const isSelected = activePin === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setActivePin(loc.id)}
                className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                {/* Ping rings */}
                <span className={`absolute w-8 h-8 rounded-full border border-blood-red/50 ${isSelected ? 'animate-ping scale-150' : 'hidden group-hover:block'}`} />
                <span className={`absolute w-12 h-12 rounded-full border border-blood-red/15 ${isSelected ? 'animate-ping scale-200' : 'hidden'}`} style={{ animationDelay: '0.5s' }} />

                {/* Marker Pin */}
                <div className={`p-2.5 rounded-full transition-all border ${
                  isSelected 
                    ? 'bg-blood-red border-blood-red text-steel-white scale-125 shadow-[0_0_15px_rgba(196,30,30,0.5)]' 
                    : 'bg-void-black border-neutral-800 text-chrome-silver hover:border-blood-red hover:text-steel-white'
                }`}>
                  {loc.type === 'hq' ? (
                    <Target size={14} className={isSelected ? 'animate-pulse' : ''} />
                  ) : (
                    <MapPin size={12} />
                  )}
                </div>

                {/* Micro Label above pointer */}
                <span className={`absolute bottom-8 px-2 py-1 rounded-none bg-[#0b0b0b]/95 border border-neutral-900 font-mono text-xs tracking-wider text-steel-white shadow-2xl whitespace-nowrap transition-all opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 ${isSelected ? 'opacity-100 scale-100 border-blood-red/30' : ''}`}>
                  {loc.id === 'shop' ? '★ DREAMVILLE' : loc.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* GPS Coordinates HUD Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-[#070707]/90 backdrop-blur-md p-3.5 border border-neutral-900 rounded-none max-w-[280px]">
          {(() => {
            const current = locations.find((l) => l.id === activePin) || locations[0];
            return (
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-blood-red">
                  <span className="w-1.5 h-1.5 rounded-full bg-blood-red animate-ping" />
                  <span className="font-bold uppercase tracking-wider">{current.name}</span>
                </div>
                <p className="text-chrome-silver text-xs leading-relaxed">{current.desc}</p>
                <div className="flex justify-between items-center border-t border-neutral-900 pt-1.5 mt-1 text-neutral-500 text-xs">
                  <span>LAT / LNG:</span>
                  <span className="text-steel-white">{current.coords}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Zoom scale HUD triggers */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 bg-[#070707]/90 backdrop-blur-sm p-1.5 border border-neutral-900 rounded-none">
          <button 
            onClick={() => setMapScale(s => Math.min(1.5, s + 0.15))}
            className="w-7 h-7 flex items-center justify-center font-mono text-xs text-chrome-silver hover:text-blood-red hover:bg-neutral-900 border border-neutral-800 rounded-none transition-all"
          >
            +
          </button>
          <button 
            onClick={() => setMapScale(s => Math.max(0.7, s - 0.15))}
            className="w-7 h-7 flex items-center justify-center font-mono text-xs text-chrome-silver hover:text-blood-red hover:bg-neutral-900 border border-neutral-800 rounded-none transition-all"
          >
            -
          </button>
        </div>

      </div>

      {/* Address HUD label */}
      <div className="bg-[#080808] border-t border-neutral-900 p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-xs text-chrome-silver">
        <div className="flex items-center gap-2">
          <Navigation size={12} className="text-blood-red" />
          <span>ADDRESS LOCK: <strong className="text-steel-white">6432 Beresford St, Burnaby, BC V5E 1B6</strong></span>
        </div>
        <a 
          href="https://maps.google.com/?q=6432+Beresford+St,+Burnaby,+BC"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary !py-2 !px-4 !text-xs shrink-0"
        >
          OPEN IN GOOGLE MAPS →
        </a>
      </div>

    </div>
  );
}
