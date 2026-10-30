import React from "react";

export default function FilmStripDoodle({
  className = "",
  size = 76,
  isDrifting = false,
  isUnrolling = false,
  ...props
}) {
  return (
    <svg
      viewBox="0 0 96 52"
      width={size}
      height={(size * 52) / 96}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-film-strip ${isDrifting ? "is-drifting" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Top and bottom undulating wavy edges of the film ribbon */}
      <path d="M6 18c14-6 28-6 42 1s28 7 42 1" />
      <path d="M6 44c14-6 28-6 42 1s28 7 42 1" />

      {/* Outer ends */}
      <line x1="6" y1="18" x2="6" y2="44" />
      <line x1="90" y1="20" x2="90" y2="46" />

      {/* Frame separator lines */}
      <line x1="33" y1="17" x2="33" y2="43" strokeWidth="1.8" />
      <line x1="61" y1="21" x2="61" y2="47" strokeWidth="1.8" />

      {/* Top sprocket perforations */}
      <g strokeWidth="1.3" opacity="0.85">
        <rect x="11" y="18" width="5" height="4" rx="1" />
        <rect x="21" y="17" width="5" height="4" rx="1" />
        <rect x="38" y="18" width="5" height="4" rx="1" />
        <rect x="49" y="19" width="5" height="4" rx="1" />
        <rect x="67" y="22" width="5" height="4" rx="1" />
        <rect x="78" y="21" width="5" height="4" rx="1" />
      </g>

      {/* Bottom sprocket perforations */}
      <g strokeWidth="1.3" opacity="0.85">
        <rect x="11" y="38" width="5" height="4" rx="1" />
        <rect x="21" y="37" width="5" height="4" rx="1" />
        <rect x="38" y="39" width="5" height="4" rx="1" />
        <rect x="49" y="40" width="5" height="4" rx="1" />
        <rect x="67" y="42" width="5" height="4" rx="1" />
        <rect x="78" y="41" width="5" height="4" rx="1" />
      </g>

      {/* Subtle frame details / cross lines */}
      <line x1="12" y1="29" x2="27" y2="28" strokeWidth="1.2" opacity="0.4" />
      <line x1="40" y1="30" x2="55" y2="31" strokeWidth="1.2" opacity="0.4" />
      <line x1="68" y1="33" x2="83" y2="32" strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}
