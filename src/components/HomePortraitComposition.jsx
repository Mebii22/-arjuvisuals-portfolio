import React from "react";
import StarDoodle from "./doodles/StarDoodle";
import CameraDoodle from "./doodles/CameraDoodle";
import { images } from "../data/images";

/**
 * HomePortraitComposition
 * Recreates Reference Image 2:
 * - Transparent PNG/WebP background-removed photographer cutout
 * - Organic, irregular deep-red graphic background shape
 * - Hand-drawn graphic details: white sketch lines, camera doodles, lens circles, curved arrows, small stars
 * - Handwritten-style signature for "Arjun Murali" (configurable)
 * - Preserves existing black-and-white mouse-over effect on the cutout image
 */
export default function HomePortraitComposition({
  profile = {},
  className = "",
}) {
  const portraitSrc =
    profile.homeHeroPortrait ||
    profile.portraitCutout ||
    profile.portrait ||
    images.profile.portraitCutout ||
    "/images/profile/arjun-home-cutout.png";

  const signatureText = profile.signatureText || profile.name || "Arjun Murali";
  const showSignature = profile.showSignature !== false;

  return (
    <div
      className={`home-portrait-composition hero-b-photo ${className}`}
      data-cursor="brand"
      aria-label={`${profile.name || "Arjun Murali"} portrait composition`}
    >
      {/* 1. Abstract organic irregular deep-red graphic shape behind subject */}
      <div className="composition-shape-wrap" aria-hidden="true">
        <svg
          viewBox="0 0 600 700"
          className="composition-shape-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="hpDeepRedGrad" x1="12%" y1="8%" x2="88%" y2="92%">
              <stop offset="0%" stopColor="#7E0C17" />
              <stop offset="50%" stopColor="#660810" />
              <stop offset="100%" stopColor="#45050A" />
            </linearGradient>
            <filter id="hpShapeShadow" x="-12%" y="-12%" width="124%" height="124%">
              <feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#270707" floodOpacity="0.28" />
            </filter>
          </defs>
          <path
            d="M 215,38 
               C 345,12 495,65 535,178 
               C 575,290 590,415 530,535 
               C 470,655 338,688 215,668 
               C 102,648 38,545 28,422 
               C 18,298 72,175 135,95 
               C 165,55 185,45 215,38 Z"
            fill="url(#hpDeepRedGrad)"
            filter="url(#hpShapeShadow)"
          />
          {/* Subtle interior organic contour accent */}
          <path
            d="M 245,72 
               C 350,52 475,102 505,205 
               C 538,308 550,418 498,512 
               C 445,606 338,632 235,616 
               C 132,600 78,510 68,400"
            stroke="#8A2630"
            strokeWidth="1.8"
            strokeDasharray="6 10"
            opacity="0.45"
            fill="none"
          />
        </svg>
      </div>

      {/* 2. Hand-drawn graphic details (independent of the portrait file) */}
      <div className="composition-doodles-wrap" aria-hidden="true">
        {/* Curved hand-drawn sketch arrow swooping from top-right towards camera/subject */}
        <svg
          viewBox="0 0 120 120"
          className="doodle-item doodle-arrow-sketch"
          fill="none"
          stroke="#F1EBEB"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 98,18 C 76,8 36,24 28,62 C 22,88 44,98 64,92 C 76,86 82,72 74,62" />
          <path d="M 62,56 L 76,62 L 78,76" strokeWidth="2.4" />
        </svg>

        {/* Lens-inspired sketch circles / viewfinder reticle */}
        <svg
          viewBox="0 0 120 120"
          className="doodle-item doodle-lens-circles"
          fill="none"
          stroke="#F1EBEB"
          strokeLinecap="round"
        >
          <circle cx="60" cy="60" r="46" strokeWidth="1.6" strokeDasharray="5 5" opacity="0.75" />
          <circle cx="60" cy="60" r="34" strokeWidth="1.8" opacity="0.85" />
          <circle cx="60" cy="60" r="18" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.6" />
          <line x1="60" y1="6" x2="60" y2="18" strokeWidth="2" opacity="0.8" />
          <line x1="60" y1="102" x2="60" y2="114" strokeWidth="2" opacity="0.8" />
          <line x1="6" y1="60" x2="18" y2="60" strokeWidth="2" opacity="0.8" />
          <line x1="102" y1="60" x2="114" y2="60" strokeWidth="2" opacity="0.8" />
        </svg>

        {/* Small sketch stars */}
        <div className="doodle-item doodle-star-top">
          <StarDoodle size={26} style={{ color: "#F1EBEB" }} />
        </div>
        <div className="doodle-item doodle-star-right">
          <StarDoodle size={20} style={{ color: "#F1EBEB" }} />
        </div>
        <div className="doodle-item doodle-star-left">
          <StarDoodle size={16} style={{ color: "#F1EBEB", opacity: 0.8 }} />
        </div>

        {/* Floating camera sketch doodle */}
        <div className="doodle-item doodle-camera-float">
          <CameraDoodle variant="vintage" size={42} style={{ color: "#F1EBEB", opacity: 0.9 }} />
        </div>

        {/* Viewfinder brackets */}
        <svg
          viewBox="0 0 100 100"
          className="doodle-item doodle-brackets"
          fill="none"
          stroke="#F1EBEB"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M 12,24 L 12,12 L 24,12" />
          <path d="M 88,24 L 88,12 L 76,12" />
          <path d="M 12,76 L 12,88 L 24,88" />
          <path d="M 88,76 L 88,88 L 76,88" />
          <line x1="50" y1="46" x2="50" y2="54" strokeWidth="1.5" />
          <line x1="46" y1="50" x2="54" y2="50" strokeWidth="1.5" />
        </svg>

        {/* Decorative squiggle stroke */}
        <svg
          viewBox="0 0 80 40"
          className="doodle-item doodle-stroke-squiggle"
          fill="none"
          stroke="#F1EBEB"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M 6,24 C 18,12 28,32 40,20 C 52,8 62,28 74,16" />
        </svg>
      </div>

      {/* 3. Foreground transparent photographer portrait cutout */}
      <div className="composition-portrait-wrap photo-ring">
        <img
          src={portraitSrc}
          alt={`${profile.name || "Arjun Murali"}, commercial photographer and visual editor`}
          className="portrait-cutout-img"
          loading="eager"
        />
      </div>

      {/* 4. Handwritten signature */}
      {showSignature && (
        <div className="composition-signature-wrap" aria-label="Signature of Arjun Murali">
          <span className="composition-signature-text">{signatureText}</span>
          <svg
            viewBox="0 0 200 24"
            className="composition-signature-underline"
            fill="none"
            stroke="var(--cyprus)"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M 6,14 C 48,11 112,13 188,7 C 196,6 198,10 186,13 C 142,22 68,18 24,18" />
          </svg>
        </div>
      )}

      {/* Existing photo caption */}
      <p className="photo-cap">Thrissur, Kerala · Visual storytelling</p>
    </div>
  );
}
