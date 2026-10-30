// Photography Doodles Library — Redesigned for ArjuVisuals.co
// Inspired by the hand-drawn black & white camera doodle reference:
// Vintage cameras, DSLRs, lenses, film rolls, film strips, birds, stars, and typography.

import VintageCameraDoodle from "./doodles/VintageCameraDoodle";
import DSLRCameraDoodle from "./doodles/DSLRCameraDoodle";
import TelephotoCameraDoodle from "./doodles/TelephotoCameraDoodle";
import CompactCameraDoodle from "./doodles/CompactCameraDoodle";
import CameraWithFlashDoodle from "./doodles/CameraWithFlashDoodle";
import HeartFrameDoodle from "./doodles/HeartFrameDoodle";
import LensDoodle from "./doodles/LensDoodle";
import FilmStripDoodle from "./doodles/FilmStripDoodle";
import FilmRollDoodle from "./doodles/FilmRollDoodle";
import BirdDoodle from "./doodles/BirdDoodle";
import StarDoodle from "./doodles/StarDoodle";
import SpeechBubbleDoodle from "./doodles/SpeechBubbleDoodle";

// Re-export new components
export {
  VintageCameraDoodle,
  DSLRCameraDoodle,
  TelephotoCameraDoodle,
  CompactCameraDoodle,
  CameraWithFlashDoodle,
  HeartFrameDoodle,
  LensDoodle,
  FilmStripDoodle,
  FilmRollDoodle,
  BirdDoodle,
  StarDoodle,
  SpeechBubbleDoodle,
};

export { default as InteractiveDoodle } from "./doodles/InteractiveDoodle";
export { default as CameraDoodle } from "./doodles/CameraDoodle";
export { default as DoodlePattern } from "./doodles/DoodlePattern";
export { default as DoodleScene } from "./doodles/DoodleScene";
export * from "./doodles/audio";

// Backwards-compatible icons updated to new hand-drawn sketch aesthetic
export function IconCamera({ className = "", ...props }) {
  return <VintageCameraDoodle className={className} size="100%" {...props} />;
}

export function IconCameraTop({ className = "", ...props }) {
  return <CompactCameraDoodle className={className} size="100%" {...props} />;
}

export function IconLens({ className = "", ...props }) {
  return <LensDoodle className={className} size="100%" {...props} />;
}

export function IconAperture({ className = "", ...props }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="32" cy="32" r="24" />
      <circle cx="32" cy="32" r="16" strokeWidth="1.6" />
      <path d="M32 8l9 16H23l9-16z" strokeWidth="1.6" />
      <path d="M50 20l-10 12 11 12 6-8-7-16z" strokeWidth="1.6" />
      <path d="M46 50l-14-8-7 14h21z" strokeWidth="1.6" />
      <path d="M14 36l10-12-8-9-7 11 5 10z" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="5" fill="currentColor" />
    </svg>
  );
}

export function IconShutter({ className = "", ...props }) {
  return <LensDoodle className={className} size="100%" isFocused={true} {...props} />;
}

export function IconFilm({ className = "", ...props }) {
  return <FilmStripDoodle className={className} size="100%" {...props} />;
}

export function IconPolaroid({ className = "", ...props }) {
  return <HeartFrameDoodle className={className} size="100%" {...props} />;
}

export function IconTripod({ className = "", ...props }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="20" y="8" width="24" height="12" rx="3" />
      <circle cx="32" cy="14" r="2.5" fill="currentColor" />
      <path d="M32 20v10M32 30L14 58M32 30l18 28M32 30v28" />
    </svg>
  );
}

export function IconFlash({ className = "", ...props }) {
  return <CameraWithFlashDoodle className={className} size="100%" {...props} />;
}

export function IconViewfinder({ className = "", ...props }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 14H6v-8h8M52 6h8v8h-8M6 50h6v8H6v-8M58 50h-6v8h6v-8" />
      <circle cx="32" cy="32" r="14" strokeWidth="1.8" />
      <path d="M32 14v6M32 44v6M14 32h6M44 32h6" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function IconMonitor({ className = "", ...props }) {
  return (
    <svg className={className} viewBox="0 0 64 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="6" y="6" width="52" height="34" rx="4" />
      <path d="M22 48h20M32 40v8" />
      <rect x="12" y="12" width="24" height="16" rx="2" strokeWidth="1.4" opacity="0.8" />
      <circle cx="48" cy="20" r="2" fill="currentColor" />
      <circle cx="48" cy="27" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function IconSpark({ className = "", ...props }) {
  return <StarDoodle className={className} size="100%" variant="sparkle" {...props} />;
}

export function IconClapper({ className = "", ...props }) {
  return (
    <svg className={className} viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="6" y="16" width="52" height="26" rx="3" />
      <path d="M8 16l10-10h14L20 16M28 6l10 10M40 6l10 10" strokeWidth="1.8" />
      <line x1="14" y1="26" x2="50" y2="26" strokeWidth="1.5" opacity="0.7" />
      <line x1="14" y1="34" x2="36" y2="34" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

export function IconQuote({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 48" fill="none" aria-hidden="true">
      <path d="M12 36c0-10 7-17 15-19v7c-5 2-8 7-8 12h8v12H12V36zM36 36c0-10 7-17 15-19v7c-5 2-8 7-8 12h8v12H36V36z" fill="currentColor" />
    </svg>
  );
}
