import React from "react";

export default function LensDoodle({
  className = "",
  size = 64,
  isFocused = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 72 72"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-lens ${isFocused ? "is-focused" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Outer ribbed barrel grip ring */}
      <circle cx="36" cy="36" r="30" />
      <circle cx="36" cy="36" r="25" strokeWidth="1.6" />

      {/* Gripping knurls / notch ticks around perimeter */}
      <g opacity="0.75" strokeWidth="1.5">
        <line x1="36" y1="6" x2="36" y2="10" />
        <line x1="36" y1="62" x2="36" y2="66" />
        <line x1="6" y1="36" x2="10" y2="36" />
        <line x1="62" y1="36" x2="66" y2="36" />
        <line x1="15" y1="15" x2="18" y2="18" />
        <line x1="54" y1="54" x2="57" y2="57" />
        <line x1="15" y1="57" x2="18" y2="54" />
        <line x1="54" y1="18" x2="57" y2="15" />
      </g>

      {/* Rotating aperture iris ring */}
      <g
        className="lens-iris-group"
        style={{
          transformOrigin: "36px 36px",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isFocused ? "rotate(45deg) scale(0.96)" : "rotate(0deg)",
        }}
      >
        <circle cx="36" cy="36" r="18" strokeWidth="1.8" />
        
        {/* Aperture blades */}
        <path d="M36 18l8 12h-16l8-12z" strokeWidth="1.4" opacity="0.8" />
        <path d="M52 28L42 38l10 10 5-8-5-10z" strokeWidth="1.4" opacity="0.8" />
        <path d="M48 52L36 44l-6 10h18z" strokeWidth="1.4" opacity="0.8" />
        <path d="M20 44l10-8-8-8-6 8 4 8z" strokeWidth="1.4" opacity="0.8" />

        {/* Center glass reflection & pupil */}
        <circle cx="36" cy="36" r="7" strokeWidth="1.6" />
        <circle
          cx="36"
          cy="36"
          r={isFocused ? "2" : "3.8"}
          fill="currentColor"
          style={{ transition: "r 0.3s ease" }}
        />
        <circle cx="34.5" cy="34.5" r="1.2" fill="var(--stone)" />
      </g>

      {/* Red lens indicator dot / line */}
      <circle cx="36" cy="11.5" r="1.5" fill={accentColor} stroke="none" />
    </svg>
  );
}
