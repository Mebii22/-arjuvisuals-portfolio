import React from "react";

export default function HeartFrameDoodle({
  className = "",
  size = 68,
  isPulsing = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 80 72"
      width={size}
      height={(size * 72) / 80}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-heart-frame ${isPulsing ? "is-pulsing" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Top prism shape & shutter */}
      <path d="M28 20L34 11h16l6 9" />
      <path d="M20 20v-4h6v4" />

      {/* Main camera / frame silhouette */}
      <rect x="10" y="20" width="60" height="46" rx="6" />

      {/* Outer lens circle */}
      <circle cx="40" cy="44" r="17" />
      <circle cx="40" cy="44" r="14" strokeWidth="1.4" opacity="0.6" />

      {/* Hand-drawn heart inside the lens */}
      <path
        className="heart-path"
        d="M40 51.5c-4.5-4-9-7.5-9-11.5 0-3 2.3-5 5.2-5 2.1 0 3.3 1.2 3.8 2 0.5-0.8 1.7-2 3.8-2 2.9 0 5.2 2 5.2 5 0 4-4.5 7.5-9 11.5z"
        fill={accentColor}
        stroke={accentColor}
        strokeWidth="1.6"
        style={{
          transformOrigin: "40px 44px",
          transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isPulsing ? "scale(1.2)" : "scale(1)",
        }}
      />

      {/* Viewfinder window & flash indicator */}
      <rect x="58" y="25" width="7" height="4.5" rx="1" strokeWidth="1.3" />
      <circle cx="18" cy="27" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
