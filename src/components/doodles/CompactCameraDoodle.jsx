import React from "react";

export default function CompactCameraDoodle({
  className = "",
  size = 68,
  isSnapping = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 84 64"
      width={size}
      height={(size * 64) / 84}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-compact-camera ${isSnapping ? "is-snapping" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Top controls: shutter button & dial */}
      <rect x="14" y="6" width="9" height="6" rx="1.5" />
      <path d="M54 12V7h12v5" />
      <path d="M58 7V4h4v3" />

      {/* Main compact body */}
      <rect x="8" y="12" width="68" height="46" rx="6" />

      {/* Top bar separator */}
      <line x1="8" y1="21" x2="76" y2="21" strokeWidth="1.6" opacity="0.6" />

      {/* Viewfinder window & flash window */}
      <rect x="14" y="15" width="8" height="4.5" rx="1" strokeWidth="1.4" />
      <circle cx="18" cy="17.2" r="1.2" fill="currentColor" />
      <rect x="26" y="15" width="5" height="4.5" rx="1" strokeWidth="1.2" opacity="0.8" />

      {/* Rangefinder circular lens on left/center */}
      <circle cx="34" cy="38" r="14" />
      <circle cx="34" cy="38" r="9.5" strokeWidth="1.6" />
      <circle
        cx="34"
        cy="38"
        r={isSnapping ? "2.5" : "5"}
        fill="currentColor"
        style={{ transition: "r 0.15s ease" }}
      />
      {/* Lens reflection tick */}
      <path d="M30 35a4 4 0 0 1 4-2" stroke="var(--stone)" strokeWidth="1.2" />

      {/* Red accent dot on front body */}
      <circle cx="16" cy="27" r="1.8" fill={accentColor} stroke="none" />

      {/* Right side distinctive crosshatch / diamond grip texture */}
      <g opacity="0.6" strokeWidth="1.2">
        <line x1="53" y1="23" x2="73" y2="43" />
        <line x1="53" y1="29" x2="73" y2="49" />
        <line x1="53" y1="35" x2="71" y2="53" />
        <line x1="57" y1="23" x2="74" y2="40" />

        <line x1="73" y1="23" x2="53" y2="43" />
        <line x1="73" y1="29" x2="53" y2="49" />
        <line x1="71" y1="23" x2="53" y2="41" />
        <line x1="73" y1="35" x2="55" y2="53" />
      </g>
    </svg>
  );
}
