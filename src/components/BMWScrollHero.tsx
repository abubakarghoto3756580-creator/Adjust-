import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 192;
const FRAME_PATH = (i: number) =>
  `/assets/hero/bmw-frames/frame_${String(i).padStart(4, '0')}.jpg`;

interface BMWScrollHeroProps {
  /** Ref to the hero <section> that should be pinned while the frame sequence scrubs */
  pinTargetRef: React.RefObject<HTMLElement>;
}

export default function BMWScrollHero({ pinTargetRef }: BMWScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // ---- Draw a single frame onto the canvas using a "cover" fit (no distortion) ----
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (cw === 0 || ch === 0) return;

    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;

    let drawW: number, drawH: number, dx: number, dy: number;
    if (imgRatio > canvasRatio) {
      drawH = ch;
      drawW = iw * (ch / ih);
      dx = (cw - drawW) / 2;
      dy = 0;
    } else {
      drawW = cw;
      drawH = ih * (cw / iw);
      dx = 0;
      dy = (ch - drawH) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  // ---- Keep canvas backing-store crisp on resize / DPR changes ----
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    renderedFrameRef.current = -1; // force a redraw at the new size
    drawFrame(currentFrameRef.current);
  };

  // ---- Preload every frame before the scroll animation is allowed to run ----
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = FRAME_PATH(i);
      const onSettle = () => {
        if (cancelled) return;
        loadedCount += 1;
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (i === 0) drawFrame(0);
        if (loadedCount === FRAME_COUNT) setReady(true);
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      imgs[i] = img;
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Handle resize independent of load state ----
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- requestAnimationFrame render loop: only paints when the target frame changes ----
  useEffect(() => {
    const loop = () => {
      if (renderedFrameRef.current !== currentFrameRef.current) {
        renderedFrameRef.current = currentFrameRef.current;
        drawFrame(renderedFrameRef.current);
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // ---- GSAP ScrollTrigger: pins the hero section and scrubs the frame index with scroll ----
  useEffect(() => {
    if (!ready || !pinTargetRef.current) return;

    const st = ScrollTrigger.create({
      trigger: pinTargetRef.current,
      start: 'top top',
      end: '+=140%',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (FRAME_COUNT - 1));
        currentFrameRef.current = idx;
      },
      onRefresh: () => resizeCanvas(),
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
      scrollTriggerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pinTargetRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden"
    >
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-black text-chrome-silver z-10">
          <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="font-mono text-xs tracking-widest text-blood-red animate-pulse">
            LOADING M3 SEQUENCE {loadProgress}%
          </span>
        </div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Scroll-cue label, matching the previous 3D viewport's interaction hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-void-black/80 backdrop-blur-md px-4 py-2 border border-carbon-gray rounded-full z-10 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-blood-red animate-ping" />
        <span className="font-mono text-[10px] tracking-wider text-chrome-silver uppercase">
          SCROLL TO ASSEMBLE THE M3
        </span>
      </div>
    </div>
  );
}
