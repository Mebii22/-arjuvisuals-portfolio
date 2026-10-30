import React from "react";

export default function BirdDoodle({
  className = "",
  size = 58,
  isChirping = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 68 68"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-bird ${isChirping ? "is-chirping" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Bird body outline (plump belly, curved back, perky tail) */}
      <path d="M46 22c-3-6-9-8-15-6-7 2-11 8-10 16 1 8 8 13 16 13 8 0 14-4 17-10 4-1 9-2 13-4-3-3-6-5-10-5 0-1 0-3-1-4z" />

      {/* Pointy open beak looking up */}
      <path d="M21 21l-7 2 6 4" />

      {/* Cute eye with pupil */}
      <circle cx="28" cy="22" r="3" strokeWidth="1.6" />
      <circle cx="27.5" cy="21.5" r="1.3" fill="currentColor" stroke="none" />

      {/* Wing arc */}
      <path d="M36 32c4 0 7 2 8 6-3 2-7 2-10 0-1-3 0-5 2-6z" strokeWidth="1.6" />

      {/* Left leg & three-toed foot */}
      <line x1="33" y1="45" x2="33" y2="58" strokeWidth="1.8" />
      <path d="M29 58l4-1 4 1" strokeWidth="1.6" />

      {/* Right leg & three-toed foot */}
      <line x1="41" y1="44" x2="41" y2="58" strokeWidth="1.8" />
      <path d="M37 58l4-1 4 1" strokeWidth="1.6" />

      {/* Playful chirp note or heart when chirping */}
      {isChirping && (
        <path
          d="M14 14c-1.5-1.5-3-1.5-4 0-1 1.5 0 3 4 5 4-2 5-3.5 4-5-1-1.5-2.5-1.5-4 0z"
          fill={accentColor}
          stroke={accentColor}
          strokeWidth="1"
          style={{ animation: "doodlePop 0.4s ease-out" }}
        />
      )}
    </svg>
  );
}
