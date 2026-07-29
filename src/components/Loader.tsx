import React, { useState, useEffect } from 'react';
import { playEngineRev } from '../lib/engineAudio';
import { ShieldCheck, Cpu, Zap, Radio } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [ignitionPressed, setIgnitionPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rpmValue, setRpmValue] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    'Initializing electronic control units (ECU)...',
    'Pre-heating dyno sensor array...',
    'Connecting 3D vertex pipeline...'
  ]);

  useEffect(() => {
    // Standard progress bar loader before ignition click
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 30) {
      setLogs((l) => [...l, 'Establishing telemetry link on Port 3000...']);
    }
    if (progress === 60) {
      setLogs((l) => [...l, 'Tuning sub-assembly grid vertices...']);
    }
    if (progress === 85) {
      setLogs((l) => [...l, 'System primed. Awaiting operator input...']);
    }
  }, [progress]);

  const handleIgnition = () => {
    if (progress < 100) return;
    setIgnitionPressed(true);
    playEngineRev();

    // Rev counter simulation
    let start: number | null = null;
    const duration = 2000; // 2 seconds engine rev

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = elapsed / duration;

      if (p < 0.2) {
        // starter motor
        setRpmValue(1200);
      } else if (p < 0.4) {
        // idle drop
        setRpmValue(800 + Math.random() * 50);
      } else if (p < 0.6) {
        // HUGE REV UP
        const factor = (p - 0.4) / 0.2; // 0 to 1
        setRpmValue(800 + Math.floor(factor * 6700)); // up to 7500 RPM
      } else if (p < 0.8) {
        // Redline limit bounce
        setRpmValue(7400 + Math.floor(Math.random() * 200) - 100);
      } else if (p < 1) {
        // Fall to idle
        const factor = (p - 0.8) / 0.2; // 0 to 1
        setRpmValue(7400 - Math.floor(factor * 6500));
      } else {
        setRpmValue(900);
        setTimeout(() => {
          onComplete(); // Enter site
        }, 300);
        return;
      }
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-void-black flex flex-col items-center justify-center p-6 transition-all duration-700 ${ignitionPressed ? 'scale-110 opacity-0 pointer-events-none' : ''}`}>
      
      {/* Background Tech Hex Grid / Carbon Detail */}
      <div className="absolute inset-0 carbon-texture opacity-30 pointer-events-none" />

      {/* Futuristic Circular RPM Gauge & Loader Content */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        
        {/* Animated Brand Header */}
        <div className="mb-8">
          <span className="font-mono text-[10px] tracking-[0.35em] text-blood-red uppercase animate-pulse">
            HIGH PERFORMANCE GARAGE
          </span>
          <h1 className="font-bebas text-[clamp(1.6rem,8.5vw,3rem)] sm:text-6xl md:text-7xl text-steel-white tracking-normal sm:tracking-widest mt-1 uppercase whitespace-nowrap px-2">
            DREAMVILLE<span className="text-blood-red neon-glow-red">.</span>AUTO
          </h1>
          <p className="font-rajdhani text-xs tracking-wider text-chrome-silver uppercase mt-1">
            Burnaby, BC · Est. 2015
          </p>
        </div>

        {/* Big Interactive 3D RPM / Core Element */}
        <div className="relative w-60 h-60 md:w-64 md:h-64 flex items-center justify-center mb-8">
          
          {/* Circular Gauges */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            {/* Dark background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-neutral-900 fill-none"
              strokeWidth="6"
            />
            {/* Red active progress line */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-blood-red fill-none transition-all duration-300"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 115}`}
              strokeDashoffset={`${2 * Math.PI * 115 * (1 - (ignitionPressed ? rpmValue / 8000 : progress / 100))}`}
              style={{ filter: 'drop-shadow(0 0 6px #c41e1e)' }}
            />
          </svg>

          {/* Inner Core: Interactive IGNITION button or Active RPM meter */}
          <div className="absolute inset-4 rounded-full bg-[#0c0c0c] border border-neutral-900 flex flex-col items-center justify-center p-4">
            {progress < 100 ? (
              <div className="flex flex-col items-center">
                <span className="font-bebas text-5xl text-steel-white tracking-wider">
                  {progress}%
                </span>
                <span className="font-mono text-[10px] tracking-widest text-chrome-silver uppercase mt-1 animate-pulse">
                  System Check
                </span>
              </div>
            ) : ignitionPressed ? (
              <div className="flex flex-col items-center justify-center">
                <span className="font-bebas text-5xl text-blood-red neon-glow-red tracking-wider">
                  {rpmValue}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-chrome-silver uppercase mt-1">
                  RPM LIMITER
                </span>
              </div>
            ) : (
              <button
                id="ignition-btn"
                onClick={handleIgnition}
                className="w-full h-full rounded-full bg-gradient-to-tr from-blood-red to-red-600 hover:from-red-600 hover:to-blood-red flex flex-col items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 group border-2 border-neutral-950 box-glow-red-heavy"
              >
                <span className="font-bebas text-3xl md:text-4xl text-steel-white tracking-widest leading-none">
                  IGNITION
                </span>
                <span className="font-mono text-[9px] tracking-widest text-steel-white/70 uppercase mt-1 group-hover:scale-105 transition-transform">
                  TAP TO START
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Diagnostics Status Box */}
        <div className="w-full bg-carbon-gray/50 border border-neutral-900 rounded-lg p-4 font-mono text-[11px] text-left text-chrome-silver">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-blood-red">
              <span className="w-1.5 h-1.5 rounded-full bg-blood-red animate-ping" />
              <span className="font-bold tracking-wider uppercase">ECU DIAL_LOG</span>
            </div>
            <span className="text-[10px] uppercase text-neutral-600">SYS_V2.0</span>
          </div>

          <div className="space-y-1.5 max-h-[80px] overflow-y-auto">
            {logs.map((log, idx) => (
              <p key={idx} className="flex gap-1.5 items-start">
                <span className="text-blood-red font-bold">&gt;</span>
                <span>{log}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Feature Icons Footer */}
        <div className="flex gap-6 items-center justify-center mt-8 text-neutral-700 font-mono text-[10px] uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-blood-red" />
            <span>OBD-II Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu size={12} />
            <span>4D Vertices</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-blood-red" />
            <span>AWD Dyno</span>
          </div>
        </div>
      </div>
    </div>
  );
}
