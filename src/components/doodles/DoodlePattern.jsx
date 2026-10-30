import React from "react";

export default function DoodlePattern({
  className = "",
  opacity = 0.08,
  accentColor = "var(--deep-red)",
  ...props
}) {
  return (
    <div
      className={`doodle-pattern-bg ${className}`}
      style={{ opacity, pointerEvents: "none" }}
      aria-hidden="true"
      {...props}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="doodle-pattern-svg"
      >
        <defs>
          <pattern
            id="arju-camera-doodle-tile"
            width="480"
            height="320"
            patternUnits="userSpaceOnUse"
          >
            {/* 1. Vintage Camera (TLR / Boxy) Top Left */}
            <g transform="translate(40, 20) rotate(-6)">
              <rect x="0" y="10" width="46" height="36" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <rect x="12" y="4" width="22" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="23" cy="28" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="23" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="23" cy="28" r="2.2" fill="currentColor" />
              <circle cx="10" cy="18" r="1.2" fill={accentColor} />
              <g opacity="0.6" fill="currentColor">
                <circle cx="8" cy="38" r="0.8" />
                <circle cx="12" cy="40" r="0.8" />
                <circle cx="34" cy="39" r="0.8" />
                <circle cx="38" cy="41" r="0.8" />
              </g>
            </g>

            {/* 2. "LENS" typography */}
            <g transform="translate(190, 22) rotate(-3)">
              <text
                x="0"
                y="18"
                fill="currentColor"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontSize="18"
                letterSpacing="1px"
              >
                LENS
              </text>
            </g>

            {/* 3. Bird doodle Top Mid-Right */}
            <g transform="translate(290, 16) rotate(4)">
              <path
                d="M26 12c-2-4-6-5-10-4-5 1-7 5-7 10 1 5 5 8 10 8 5 0 9-3 11-6 3-1 6-1 8-3-2-2-4-3-6-3 0-1 0-2-1-2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path d="M10 11l-4 1 4 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="15" cy="12" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="14.5" cy="11.5" r="0.8" fill="currentColor" />
              <line x1="18" y1="26" x2="18" y2="34" stroke="currentColor" strokeWidth="1.6" />
              <line x1="23" y1="25" x2="23" y2="34" stroke="currentColor" strokeWidth="1.6" />
            </g>

            {/* 4. Film Roll (35mm Canister) Top Right */}
            <g transform="translate(390, 18) rotate(10)">
              <path d="M18 5v-3h7v3" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="21" cy="7" rx="10" ry="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 7v22c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5V7" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 11c-5-1-12-1-16 3v10c4-1 11-1 16 2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="-3" y="15" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="21" cy="18" r="1.5" fill={accentColor} />
            </g>

            {/* 5. Curved Film Strip Top Center-Right */}
            <g transform="translate(130, 60) rotate(5)">
              <path d="M0 10c10-4 20-4 30 1s20 5 30 1" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M0 26c10-4 20-4 30 1s20 5 30 1" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <line x1="0" y1="10" x2="0" y2="26" stroke="currentColor" strokeWidth="1.6" />
              <line x1="60" y1="12" x2="60" y2="28" stroke="currentColor" strokeWidth="1.6" />
              <line x1="20" y1="9" x2="20" y2="25" stroke="currentColor" strokeWidth="1.4" />
              <line x1="40" y1="12" x2="40" y2="28" stroke="currentColor" strokeWidth="1.4" />
              <rect x="5" y="10.5" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="25" y="11" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="45" y="13" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="5" y="22.5" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="25" y="23" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="45" y="25" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
            </g>

            {/* 6. Angled Telephoto DSLR with "FULL FRAME" */}
            <g transform="translate(60, 95) rotate(-35)">
              <rect x="24" y="10" width="20" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <rect x="6" y="12" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <line x1="10" y1="13" x2="10" y2="29" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
              <line x1="14" y1="13" x2="14" y2="29" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
              <line x1="18" y1="13" x2="18" y2="29" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
              <path d="M6 10L-1 8v26l7-2z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="28" cy="15" r="1.2" fill={accentColor} />
            </g>
            <g transform="translate(100, 160)">
              <text
                x="0"
                y="0"
                fill="currentColor"
                fontFamily="'Outfit', sans-serif"
                fontWeight="900"
                fontSize="9"
                letterSpacing="0.8px"
              >
                FULL FRAME
              </text>
            </g>

            {/* 7. Compact Camera with Crosshatch Pattern Center-Right */}
            <g transform="translate(290, 105) rotate(4)">
              <rect x="0" y="8" width="50" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <line x1="0" y1="14" x2="50" y2="14" stroke="currentColor" strokeWidth="1.3" opacity="0.6" />
              <circle cx="20" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="20" cy="25" r="3.5" fill="currentColor" />
              {/* Crosshatch texture */}
              <g opacity="0.5" stroke="currentColor" strokeWidth="1">
                <line x1="34" y1="16" x2="48" y2="30" />
                <line x1="34" y1="21" x2="48" y2="35" />
                <line x1="48" y1="16" x2="34" y2="30" />
                <line x1="48" y1="21" x2="34" y2="35" />
              </g>
              <circle cx="7" cy="18" r="1" fill={accentColor} />
            </g>

            {/* 8. Star Doodle & Sparkles */}
            <g transform="translate(225, 115)">
              <path
                d="M10 2l2.5 5 5.5 0.8-4 3.7 1 5.5-5-2.6-5 2.6 1-5.5-4-3.7 5.5-0.8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </g>
            <g transform="translate(420, 110)">
              <path
                d="M10 2c0.8 4 4 7 8 8-4 0.8-7 4-8 8-0.8-4-4-7-8-8 4-0.8 7-4 8-8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </g>

            {/* 9. Speech Bubble "CLICK IT!" */}
            <g transform="translate(20, 185) rotate(-4)">
              <path
                d="M24 38c-10 0-18-7-18-16S14 6 24 6s18 7 18 16c0 4-1.5 7.5-4 10.5L40 43l-9-3c-2 1-4.5 1.5-7 1.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <text
                x="24"
                y="19"
                textAnchor="middle"
                fill="currentColor"
                fontFamily="'Impact', sans-serif"
                fontSize="9"
                letterSpacing="0.5px"
              >
                CLICK
              </text>
              <text
                x="24"
                y="29"
                textAnchor="middle"
                fill="currentColor"
                fontFamily="'Impact', sans-serif"
                fontSize="10"
                letterSpacing="0.5px"
              >
                IT!
              </text>
            </g>

            {/* 10. DSLR Camera Body Front Center */}
            <g transform="translate(130, 205) rotate(2)">
              <path d="M12 8L15 3h12l3 5" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <rect x="0" y="8" width="52" height="38" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="28" cy="26" r="12" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="28" cy="26" r="5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="28" cy="26" r="2.5" fill="currentColor" />
              <g opacity="0.5" fill="currentColor">
                <circle cx="45" cy="18" r="0.8" />
                <circle cx="47" cy="21" r="0.8" />
                <circle cx="45" cy="26" r="0.8" />
                <circle cx="47" cy="30" r="0.8" />
              </g>
              <circle cx="10" cy="14" r="1.2" fill={accentColor} />
            </g>

            {/* 11. Heart Frame Camera Mid-Right */}
            <g transform="translate(320, 195) rotate(-3)">
              <path d="M14 8L18 3h12l4 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="0" y="8" width="48" height="36" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="24" cy="26" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {/* Heart inside */}
              <path
                d="M24 30.5c-2.8-2.5-5.5-4.5-5.5-7 0-1.8 1.4-3 3.2-3 1.3 0 2 0.7 2.3 1.2 0.3-0.5 1-1.2 2.3-1.2 1.8 0 3.2 1.2 3.2 3 0 2.5-2.7 4.5-5.5 7z"
                fill={accentColor}
                stroke={accentColor}
                strokeWidth="0.8"
              />
            </g>

            {/* 12. "Smile" Cloud Speech Bubble */}
            <g transform="translate(230, 260) rotate(2)">
              <path
                d="M14 11c-3 0-5.5 2.5-5.5 5.5 0 1.2 0.4 2.5 1.2 3.4-2.5 1-3.7 3.4-3.1 5.9 0.6 2.5 2.8 4.4 5.5 4.4 0.6 0 1.5-0.2 2.2-0.5 1.2 2.8 4 4.7 7.2 4.7 2.5 0 4.7-1.1 5.9-2.8 1.2 1.7 3.4 2.8 5.9 2.8 3.1 0 5.9-1.9 7.2-4.7 0.6 0.3 1.5 0.5 2.2 0.5 2.8 0 5-1.9 5.5-4.4 0.6-2.5-0.6-4.9-3.1-5.9 0.8-0.9 1.2-2.2 1.2-3.4 0-3-2.5-5.5-5.5-5.5-0.9 0-1.9 0.3-2.8 0.8-1.6-2.6-4.4-4.3-7.5-4.3-2.2 0-4.2 0.9-5.7 2.4-1.5-1.5-3.5-2.4-5.7-2.4-3.1 0-5.9 1.7-7.5 4.3-0.9-0.5-1.9-0.8-2.9-0.8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <text
                x="30"
                y="23"
                textAnchor="middle"
                fill="currentColor"
                fontFamily="'Caveat', cursive, sans-serif"
                fontWeight="bold"
                fontSize="14"
              >
                Smile
              </text>
            </g>

            {/* 13. Camera with Flash Rays Bottom Left */}
            <g transform="translate(30, 255) rotate(4)">
              <line x1="22" y1="0" x2="22" y2="4" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="2" x2="17" y2="5" stroke="currentColor" strokeWidth="1.4" />
              <line x1="30" y1="2" x2="27" y2="5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="16" y="6" width="12" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="0" y="13" width="44" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="24" cy="28" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="24" cy="28" r="3" fill="currentColor" />
            </g>

            {/* 14. Horizontal DSLR Telephoto Bottom Right */}
            <g transform="translate(390, 240) rotate(-2)">
              <rect x="22" y="5" width="22" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <rect x="0" y="9" width="22" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="5" y1="10" x2="5" y2="26" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
              <line x1="9" y1="10" x2="9" y2="26" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
              <line x1="13" y1="10" x2="13" y2="26" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
              <line x1="17" y1="10" x2="17" y2="26" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#arju-camera-doodle-tile)" />
      </svg>
    </div>
  );
}
