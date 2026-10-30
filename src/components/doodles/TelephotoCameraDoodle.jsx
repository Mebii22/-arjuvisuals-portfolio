import React from "react";

export default function TelephotoCameraDoodle({
  className = "",
  size = 84,
  variant = "angled", // "angled" or "horizontal"
  isSnapping = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  if (variant === "horizontal") {
    return (
      <svg
        viewBox="0 0 100 60"
        width={size}
        height={(size * 60) / 100}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`doodle-svg doodle-telephoto-horizontal ${isSnapping ? "is-snapping" : ""} ${className}`}
        aria-hidden="true"
        {...props}
      >
        {/* DSLR Body on right */}
        <path d="M72 16h8l4-6h10l3 6h3a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4h-24a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4z" />
        <path d="M84 10V6h6v4" />
        <circle cx="95" cy="12" r="2" />
        <path d="M96 24v22" opacity="0.6" strokeWidth="1.6" />
        <circle cx="76" cy="22" r="1.5" fill={accentColor} stroke="none" />

        {/* Telephoto Barrel extending left */}
        <rect x="52" y="22" width="20" height="24" rx="2" />
        <line x1="57" y1="22" x2="57" y2="46" strokeWidth="1.5" />
        <line x1="62" y1="22" x2="62" y2="46" strokeWidth="1.5" />
        <line x1="67" y1="22" x2="67" y2="46" strokeWidth="1.5" />

        {/* Zoom ring segment with ribbed hatching */}
        <rect x="22" y="19" width="30" height="30" rx="3" />
        <line x1="27" y1="20" x2="27" y2="48" strokeWidth="1.3" opacity="0.75" />
        <line x1="31" y1="20" x2="31" y2="48" strokeWidth="1.3" opacity="0.75" />
        <line x1="35" y1="20" x2="35" y2="48" strokeWidth="1.3" opacity="0.75" />
        <line x1="39" y1="20" x2="39" y2="48" strokeWidth="1.3" opacity="0.75" />
        <line x1="43" y1="20" x2="43" y2="48" strokeWidth="1.3" opacity="0.75" />
        <line x1="47" y1="20" x2="47" y2="48" strokeWidth="1.3" opacity="0.75" />

        {/* Distance scale window */}
        <rect x="30" y="15" width="14" height="4" rx="1" strokeWidth="1.4" />

        {/* Lens hood & front element */}
        <path d="M22 17L10 14v40l12-3z" />
        <ellipse cx="10" cy="34" rx="3.5" ry="20" />
        <ellipse
          cx="10"
          cy="34"
          rx={isSnapping ? "1.5" : "2"}
          ry={isSnapping ? "7" : "12"}
          fill="currentColor"
        />
      </svg>
    );
  }

  // Default "angled" variant: DSLR camera pointing down-left at ~45deg
  return (
    <svg
      viewBox="0 0 92 88"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-telephoto-angled ${isSnapping ? "is-snapping" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      <g transform="rotate(-36 46 44)">
        {/* Camera body on right */}
        <path d="M56 22h8l3-6h8l3 6h4a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H56a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4z" />
        <path d="M68 16V12h6v4" />
        <circle cx="78" cy="18" r="1.8" />
        <circle cx="58" cy="27" r="1.5" fill={accentColor} stroke="none" />

        {/* Lens mount & barrel collar */}
        <rect x="42" y="27" width="10" height="22" rx="2" />

        {/* Focus distance window */}
        <rect x="34" y="23" width="10" height="4" rx="1" strokeWidth="1.3" />

        {/* Ribbed zoom ring barrel */}
        <rect x="18" y="24" width="24" height="28" rx="2" />
        <line x1="22" y1="25" x2="22" y2="51" strokeWidth="1.3" opacity="0.75" />
        <line x1="26" y1="25" x2="26" y2="51" strokeWidth="1.3" opacity="0.75" />
        <line x1="30" y1="25" x2="30" y2="51" strokeWidth="1.3" opacity="0.75" />
        <line x1="34" y1="25" x2="34" y2="51" strokeWidth="1.3" opacity="0.75" />
        <line x1="38" y1="25" x2="38" y2="51" strokeWidth="1.3" opacity="0.75" />

        {/* Lens hood flare at front */}
        <path d="M18 22L7 19v38l11-3z" />
        <ellipse cx="7" cy="38" rx="3" ry="19" />
        <ellipse
          cx="7"
          cy="38"
          rx={isSnapping ? "1.2" : "1.8"}
          ry={isSnapping ? "6" : "10"}
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
