import React from "react";

export default function VintageCameraDoodle({
  className = "",
  size = 64,
  isSnapping = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-vintage-camera ${isSnapping ? "is-snapping" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Top housing & knobs */}
      <rect x="24" y="9" width="32" height="10" rx="3" />
      <path d="M30 9V5h20v4" />
      <path d="M14 14h6v5h-6z" />
      <path d="M60 14h6v5h-6z" />
      
      {/* Shutter button */}
      <path d="M20 9V6h4v3" />

      {/* Main camera body */}
      <rect x="10" y="18" width="60" height="54" rx="7" />

      {/* Strap eyelets on sides */}
      <path d="M10 32H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h4" />
      <path d="M70 32h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4" />
      <circle cx="5" cy="46" r="1.5" fill="currentColor" />
      <circle cx="75" cy="46" r="1.5" fill="currentColor" />

      {/* Top small viewfinder window */}
      <rect x="35" y="23" width="10" height="7" rx="2" />
      <circle cx="40" cy="26.5" r="1.8" fill="currentColor" />

      {/* Central classic circular lens mount */}
      <circle cx="40" cy="46" r="15" />
      <circle cx="40" cy="46" r="11" />
      <circle
        cx="40"
        cy="46"
        r={isSnapping ? "3" : "6"}
        fill="currentColor"
        style={{ transition: "r 0.15s ease" }}
      />
      {/* Inner reflection glint */}
      <path d="M36 43a5 5 0 0 1 5-2" stroke="var(--stone)" strokeWidth="1.4" />

      {/* 4 Corner lens screws */}
      <circle cx="21" cy="38" r="1" fill="currentColor" />
      <circle cx="59" cy="38" r="1" fill="currentColor" />
      <circle cx="21" cy="54" r="1" fill="currentColor" />
      <circle cx="59" cy="54" r="1" fill="currentColor" />

      {/* Textured leatherette stippling dots on bottom body */}
      <g opacity="0.65" stroke="none" fill="currentColor">
        <circle cx="16" cy="64" r="1" />
        <circle cx="21" cy="62" r="1" />
        <circle cx="26" cy="65" r="1" />
        <circle cx="31" cy="63" r="1" />
        <circle cx="49" cy="63" r="1" />
        <circle cx="54" cy="65" r="1" />
        <circle cx="59" cy="62" r="1" />
        <circle cx="64" cy="64" r="1" />
        <circle cx="23" cy="67" r="0.9" />
        <circle cx="57" cy="67" r="0.9" />
      </g>

      {/* Red accent dot */}
      <circle cx="20" cy="25" r="2" fill={accentColor} stroke="none" />
    </svg>
  );
}
