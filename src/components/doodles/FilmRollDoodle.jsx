import React from "react";

export default function FilmRollDoodle({
  className = "",
  size = 64,
  isUnrolling = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 76 68"
      width={size}
      height={(size * 68) / 76}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-film-roll ${isUnrolling ? "is-unrolling" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Top spool hub / spindle with tooth notches */}
      <path d="M42 9V5h12v4" />
      <line x1="45" y1="5" x2="45" y2="8" strokeWidth="1.4" />
      <line x1="51" y1="5" x2="51" y2="8" strokeWidth="1.4" />

      {/* Top rim cap */}
      <ellipse cx="48" cy="12" rx="15" ry="4.5" />

      {/* Canister cylindrical body */}
      <path d="M33 12v36c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5V12" />

      {/* Bottom rim cap */}
      <path d="M36 49v3c0 2.5 5.4 4 12 4s12-1.5 12-4v-3" />

      {/* Canister label stripes & brand badge */}
      <path d="M33 22c4 1.8 9 2.5 15 2.5s11-0.7 15-2.5" opacity="0.6" strokeWidth="1.4" />
      <path d="M33 38c4 1.8 9 2.5 15 2.5s11-0.7 15-2.5" opacity="0.6" strokeWidth="1.4" />
      <circle cx="48" cy="30" r="4.5" strokeWidth="1.3" />
      <circle cx="48" cy="30" r="1.8" fill={accentColor} stroke="none" />

      {/* Film leader tongue sticking out of the felt slit to the left with animated pull */}
      <g
        className="film-leader-tongue"
        style={{
          transformOrigin: "33px 26px",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isUnrolling ? "translateX(-6px) scaleX(1.15)" : "translateX(0) scaleX(1)",
        }}
      >
        <path d="M33 18c-8-2-18-1-24 5v16c6-1 16-1 24 3" />
        
        {/* Sprocket holes along the film leader */}
        <g strokeWidth="1.3" opacity="0.85">
          <rect x="13" y="24" width="4.5" height="3.5" rx="0.8" />
          <rect x="21" y="25" width="4.5" height="3.5" rx="0.8" />
          <rect x="13" y="32" width="4.5" height="3.5" rx="0.8" />
          <rect x="21" y="33" width="4.5" height="3.5" rx="0.8" />
        </g>
      </g>
    </svg>
  );
}
