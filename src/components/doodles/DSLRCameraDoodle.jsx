import React from "react";

export default function DSLRCameraDoodle({
  className = "",
  size = 72,
  isSnapping = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 88 74"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-dslr ${isSnapping ? "is-snapping" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Top pentaprism hump & hot shoe */}
      <path d="M36 18L40 9h16l4 9" />
      <path d="M43 9V5h10v4" />
      <path d="M41 5h14" />

      {/* Left mode dial */}
      <rect x="18" y="14" width="11" height="7" rx="1.5" />
      <path d="M21 14v-2h5v2" />

      {/* Right shutter button & front control dial */}
      <path d="M68 18l5-5h6v7" />
      <path d="M72 13V9h4v4" />

      {/* Main ergonomic DSLR body outline */}
      <path d="M12 21h22l2-3h24l2 3h16c3.3 0 6 2.7 6 6v36c0 4.4-3.6 8-8 8H16c-4.4 0-8-3.6-8-8V27c0-3.3 2.7-6 6-6z" />

      {/* Right handgrip texture contour */}
      <path d="M72 26c4 4 4 28 0 38" opacity="0.6" strokeWidth="1.6" />
      <g opacity="0.55" stroke="none" fill="currentColor">
        <circle cx="76" cy="34" r="1" />
        <circle cx="79" cy="37" r="1" />
        <circle cx="76" cy="42" r="1" />
        <circle cx="79" cy="46" r="1" />
        <circle cx="76" cy="51" r="1" />
        <circle cx="78" cy="56" r="1" />
      </g>

      {/* Left side texture stippling */}
      <g opacity="0.5" stroke="none" fill="currentColor">
        <circle cx="15" cy="34" r="1" />
        <circle cx="19" cy="38" r="1" />
        <circle cx="15" cy="44" r="1" />
        <circle cx="18" cy="50" r="1" />
        <circle cx="14" cy="56" r="1" />
      </g>

      {/* AF assist lamp & mic holes */}
      <circle cx="28" cy="27" r="2.2" fill={accentColor} stroke="none" />
      <circle cx="27" cy="34" r="0.8" fill="currentColor" />
      <circle cx="29" cy="34" r="0.8" fill="currentColor" />

      {/* Large central pro lens mount */}
      <circle cx="48" cy="45" r="17" />
      <circle cx="48" cy="45" r="12.5" strokeWidth="1.6" />
      <circle
        cx="48"
        cy="45"
        r={isSnapping ? "3" : "7"}
        fill="currentColor"
        style={{ transition: "r 0.15s ease" }}
      />

      {/* Aperture blades / glass reflection arcs */}
      <path d="M43 40l6-3M53 43l3 6M49 51l-6 2M41 47l-1-6" stroke="var(--stone)" strokeWidth="1.3" opacity="0.85" />
      <path d="M43 38a8 8 0 0 1 7-2" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />

      {/* Lens release button */}
      <circle cx="33" cy="55" r="2" />
    </svg>
  );
}
