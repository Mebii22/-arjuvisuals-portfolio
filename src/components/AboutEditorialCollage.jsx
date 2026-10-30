import React from "react";
import StarDoodle from "./doodles/StarDoodle";
import CameraDoodle from "./doodles/CameraDoodle";
import FilmStripDoodle from "./doodles/FilmStripDoodle";
import { images } from "../data/images";

/**
 * AboutEditorialCollage
 * Recreates Reference Image 3:
 * - Prominent photographer portrait layered over an organic deep-red graphic shape
 * - Secondary printed photograph with white border and realistic washi tape detail
 * - Film-strip graphic with sprocket holes
 * - Small camera doodles and hand-drawn annotations in script typography
 * - Thin editorial lines and warm stone paper texture accents
 * - Fully modular & independent assets
 */
export default function AboutEditorialCollage({
  profile = {},
  secondaryImage,
  className = "",
}) {
  const mainPortrait =
    profile.aboutMainPortrait ||
    profile.aboutPortrait ||
    profile.portraitCutout ||
    profile.portrait ||
    images.profile.aboutPortrait ||
    "/images/profile/arjun-home-cutout.png";

  const secondaryPhoto =
    secondaryImage ||
    profile.aboutPolaroid ||
    profile.portraitAlt ||
    images.profile.aboutPolaroid ||
    "/images/profile/arjun-portrait-alt.jpg";

  return (
    <div
      className={`about-editorial-collage ${className}`}
      aria-label="Editorial photography collage"
    >
      {/* 1. Warm Stone & Deep Red Organic Background Shape */}
      <div className="collage-shape-bg" aria-hidden="true">
        <svg
          viewBox="0 0 540 640"
          className="collage-shape-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="aboutRedGrad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#780A15" />
              <stop offset="55%" stopColor="#660810" />
              <stop offset="100%" stopColor="#3E0409" />
            </linearGradient>
            <filter id="aboutShapeShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#270707" floodOpacity="0.22" />
            </filter>
          </defs>
          <path
            d="M 180,30 
               C 310,10 440,50 480,160 
               C 520,270 535,390 480,500 
               C 425,610 290,630 180,610 
               C 70,590 20,490 15,370 
               C 10,250 50,150 110,80 
               C 135,50 155,40 180,30 Z"
            fill="url(#aboutRedGrad)"
            filter="url(#aboutShapeShadow)"
          />
        </svg>
      </div>

      {/* 2. Paper Torn-Edge & Editorial Grid Accents */}
      <div className="collage-paper-accents" aria-hidden="true">
        {/* Subtle deckle/torn paper edge strip on the left */}
        <div className="paper-torn-strip" />
        
        {/* Editorial frame measurement ticks */}
        <div className="editorial-ticks">
          <span>01</span>
          <span className="tick-line" />
          <span>PORTRAIT // ARCHIVE</span>
        </div>
      </div>

      {/* 3. Main Prominent Portrait (Transparent Cutout or Photograph) */}
      <div className="collage-main-portrait-wrap" data-cursor="brand">
        <img
          src={mainPortrait}
          alt={`${profile.name || "Arjun Murali"}, photographer`}
          className="collage-main-portrait-img"
          loading="eager"
        />
        {/* Lens focal reticle sketch over shoulder */}
        <svg
          viewBox="0 0 80 80"
          className="collage-lens-reticle"
          fill="none"
          stroke="#F1EBEB"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="40" cy="40" r="32" strokeDasharray="4 3" opacity="0.8" />
          <circle cx="40" cy="40" r="22" opacity="0.6" />
          <line x1="40" y1="2" x2="40" y2="10" />
          <line x1="40" y1="70" x2="40" y2="78" />
          <line x1="2" y1="40" x2="10" y2="40" />
          <line x1="70" y1="40" x2="78" y2="40" />
        </svg>
      </div>

      {/* 4. Secondary Photograph (Styled as Printed Photo with Washi Tape) */}
      <div className="collage-secondary-card">
        {/* Realistic Washi Tape Detail */}
        <div className="washi-tape" aria-hidden="true" />
        
        <div className="printed-photo-frame">
          <img
            src={secondaryPhoto}
            alt={`${profile.name || "Arjun Murali"} — Studio Portrait`}
            className="printed-photo-img"
          />
          <div className="printed-photo-caption">
            <span className="caption-tag">
              {profile.aboutPolaroidCaption || "Arjun Murali · Studio Candid"}
            </span>
            <span className="caption-meta">
              {profile.aboutPolaroidMeta || "Thrissur // Ray-Ban Studio"}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Film Strip Graphic */}
      <div className="collage-film-strip-wrap" aria-hidden="true">
        <FilmStripDoodle size={110} style={{ color: "#270707" }} />
      </div>

      {/* 6. Hand-drawn Annotations & Doodles */}
      <div className="collage-doodles-layer" aria-hidden="true">
        {/* Small Camera Doodle */}
        <div className="collage-camera-doodle">
          <CameraDoodle variant="compact" size={48} style={{ color: "var(--cyprus)" }} />
        </div>

        {/* Handwritten Annotation 1 */}
        <div className="handwritten-note note-lens">
          <svg viewBox="0 0 60 40" className="note-arrow" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M 4,32 C 18,28 36,18 52,6" />
            <path d="M 40,6 L 52,6 L 50,18" />
          </svg>
          <span>natural lighting</span>
        </div>

        {/* Handwritten Annotation 2 */}
        <div className="handwritten-note note-location">
          <span>Kerala · 2026</span>
        </div>

        {/* Hand-drawn Star */}
        <div className="collage-star">
          <StarDoodle size={24} style={{ color: "#F1EBEB" }} />
        </div>
      </div>
    </div>
  );
}
