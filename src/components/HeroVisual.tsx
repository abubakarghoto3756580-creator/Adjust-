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
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      </picture>

      {/* Bottom fade: transparent at top -> near-black at bottom, so text sitting below/over stays legible */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          strongOverlay
            ? 'from-void-black via-void-black/75 to-void-black/25'
            : 'from-void-black via-void-black/30 to-transparent'
        }`}
      />

      {/* Left fade: near-black at the edge where the text column sits, fading out toward the car */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          strongOverlay
            ? 'from-void-black/85 via-void-black/40 to-transparent'
            : 'from-void-black/70 via-transparent to-transparent'
        }`}
      />
    </div>
  );
}
