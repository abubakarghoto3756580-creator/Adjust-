import React from 'react';

const WEBP_SRC = '/assets/hero/bmw-m3-shell.webp';
const JPG_SRC = '/assets/hero/bmw-m3-shell.jpg';

interface HeroVisualProps {
  /** Extra classes for the outer wrapper (used to size the desktop panel vs. mobile full-bleed bg) */
  className?: string;
  /** Slightly stronger overlay for the mobile full-bleed background variant */
  strongOverlay?: boolean;
}

export default function HeroVisual({ className = '', strongOverlay = false }: HeroVisualProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <picture>
        <source srcSet={WEBP_SRC} type="image/webp" />
        <img
          src={JPG_SRC}
          alt="Yas Marina Blue BMW M3 parked front three-quarter under a red LED-lit Shell canopy at night, wet reflective floor"
          className="absolute inset-0 w-full h-full object-cover object-[62%_38%] lg:object-[70%_50%]"
          loading="eager"
        />
      </picture>

      {/* Left fade: near-black where the text sits (left third on desktop), fading out toward the car on the right */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          strongOverlay
            ? 'from-void-black/90 via-void-black/55 to-transparent'
            : 'from-void-black/85 via-void-black/25 to-transparent'
        }`}
      />

      {/* Bottom fade: near-black at the bottom (mobile text zone), transparent toward the top */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          strongOverlay
            ? 'from-void-black/95 via-void-black/50 to-transparent'
            : 'from-void-black/40 via-transparent to-transparent'
        }`}
      />
    </div>
  );
}
