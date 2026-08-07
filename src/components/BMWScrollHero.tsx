import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = '/assets/hero/bmw-assembly.mp4';

interface BMWScrollHeroProps {
  /** Ref to the hero <section> that should be pinned while the video scrubs */
  pinTargetRef: React.RefObject<HTMLElement>;
}

export default function BMWScrollHero({ pinTargetRef }: BMWScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const targetTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ---- Preload the clip fully before allowing the scroll-scrub to begin ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const onProgress = () => {
      if (cancelled || !video.buffered.length || !video.duration) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setLoadProgress(Math.min(100, Math.round((bufferedEnd / video.duration) * 100)));
    };

    const onCanPlayThrough = () => {
      if (cancelled) return;
      setLoadProgress(100);
      setReady(true);
    };

    video.addEventListener('progress', onProgress);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    video.addEventListener('loadeddata', onProgress);

    video.load();

    return () => {
      cancelled = true;
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('loadeddata', onProgress);
    };
  }, []);

  // ---- requestAnimationFrame loop: smoothly nudges currentTime toward the scroll-driven target ----
  useEffect(() => {
    const loop = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const delta = targetTimeRef.current - video.currentTime;
        // Small threshold avoids fighting the decoder with sub-frame seeks every tick
        if (Math.abs(delta) > 0.02) {
          video.currentTime = targetTimeRef.current;
        }
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // ---- GSAP ScrollTrigger: pins the hero section and scrubs video.currentTime with scroll ----
  useEffect(() => {
    if (!ready || !pinTargetRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const duration = video.duration || 8;

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
        targetTimeRef.current = self.progress * duration;
      },
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

      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Scroll-cue label */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-void-black/80 backdrop-blur-md px-4 py-2 border border-carbon-gray rounded-full z-10 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-blood-red animate-ping" />
        <span className="font-mono text-[10px] tracking-wider text-chrome-silver uppercase">
          SCROLL TO ASSEMBLE THE M3
        </span>
      </div>
    </div>
  );
}
