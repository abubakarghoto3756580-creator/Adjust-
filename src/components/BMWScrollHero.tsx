import React, { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/assets/hero/bmw-assembly.mp4';

export default function BMWScrollHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const onProgress = () => {
      if (cancelled || !video.buffered.length || !video.duration) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setLoadProgress(Math.min(100, Math.round((bufferedEnd / video.duration) * 100)));
    };

    const onCanPlay = () => {
      if (cancelled) return;
      setLoadProgress(100);
      setReady(true);
      video.play().catch(() => {
        /* Autoplay may be blocked until user interaction — safe to ignore, video is muted+loop */
      });
    };

    video.addEventListener('progress', onProgress);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('loadeddata', onProgress);

    video.load();

    return () => {
      cancelled = true;
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadeddata', onProgress);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
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
        loop
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
    </div>
  );
}
