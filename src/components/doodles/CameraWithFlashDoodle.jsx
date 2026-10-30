import React from "react";

export default function CameraWithFlashDoodle({
  className = "",
  size = 70,
  isSnapping = false,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <svg
      viewBox="0 0 84 80"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-camera-flash ${isSnapping ? "is-snapping" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Radiating flash burst lines on top */}
      <g
        className="flash-burst-rays"
        strokeWidth="2"
        opacity={isSnapping ? "1" : "0.75"}
        style={{
          transformOrigin: "42px 14px",
          transition: "transform 0.18s ease, opacity 0.18s ease",
          transform: isSnapping ? "scale(1.2)" : "scale(1)",
        }}
      >
        <line x1="42" y1="2" x2="42" y2="7" />
        <line x1="28" y1="5" x2="33" y2="9" />
        <line x1="56" y1="5" x2="51" y2="9" />
        <line x1="20" y1="11" x2="25" y2="13" />
        <line x1="64" y1="11" x2="59" y2="13" />
      </g>

      {/* Pop-up flash unit */}
      <rect x="33" y="11" width="18" height="11" rx="2" />
      <rect
        x="36"
        y="14"
        width="12"
        height="5"
        rx="1"
        fill={isSnapping ? accentColor : "none"}
        strokeWidth="1.4"
      />

      {/* Shutter button & dial on shoulders */}
      <path d="M16 22v-4h8v4" />
      <path d="M64 22v-3h7v3" />

      {/* Camera body */}
      <rect x="10" y="22" width="64" height="48" rx="6" />

      {/* Grip groove lines on left */}
      <line x1="16" y1="28" x2="16" y2="64" strokeWidth="1.6" opacity="0.6" />
      <line x1="20" y1="28" x2="20" y2="64" strokeWidth="1.6" opacity="0.6" />
      <line x1="24" y1="28" x2="24" y2="64" strokeWidth="1.6" opacity="0.6" />

      {/* Red accent dot on front */}
      <circle cx="28" cy="27" r="1.6" fill={accentColor} stroke="none" />

      {/* Viewfinder window */}
      <rect x="60" y="26" width="8" height="5" rx="1" strokeWidth="1.4" />

      {/* Central lens */}
      <circle cx="46" cy="46" r="15" />
      <circle cx="46" cy="46" r="10.5" strokeWidth="1.6" />
      <circle
        cx="46"
        cy="46"
        r={isSnapping ? "3" : "5.5"}
        fill="currentColor"
        style={{ transition: "r 0.15s ease" }}
      />
      <circle cx="46" cy="46" r="2.5" fill="var(--stone)" opacity="0.8" />
    </svg>
  );
}
