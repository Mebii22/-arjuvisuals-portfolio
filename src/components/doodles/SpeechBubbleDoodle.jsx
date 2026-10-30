import React from "react";

export default function SpeechBubbleDoodle({
  variant = "click", // "click" | "smile" | "lens" | "fullframe"
  className = "",
  size = 72,
  accentColor = "var(--deep-red)",
  isPopping = false,
  ...props
}) {
  if (variant === "smile") {
    // Scalloped cloud bubble with cursive "Smile" from reference image
    return (
      <svg
        viewBox="0 0 94 62"
        width={size}
        height={(size * 62) / 94}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`doodle-svg doodle-speech-smile ${isPopping ? "is-popping" : ""} ${className}`}
        aria-hidden="true"
        {...props}
      >
        {/* Scalloped cloud outline */}
        <path d="M22 17c-5 0-9 4-9 9 0 2 0.7 4 2 5.5-4 1.5-6 5.5-5 9.5 1 4 4.5 7 9 7 1 0 2.5-0.3 3.5-0.8 2 4.5 6.5 7.5 11.5 7.5 4 0 7.5-1.8 9.5-4.5 2 2.7 5.5 4.5 9.5 4.5 5 0 9.5-3 11.5-7.5 1 0.5 2.5 0.8 3.5 0.8 4.5 0 8-3 9-7 1-4-1-8-5-9.5 1.3-1.5 2-3.5 2-5.5 0-5-4-9-9-9-1.5 0-3 0.4-4.5 1.2-2.5-4.2-7-6.9-12-6.9-3.5 0-6.8 1.4-9.2 3.8-2.4-2.4-5.7-3.8-9.2-3.8-5 0-9.5 2.7-12 6.9-1.5-0.8-3-1.2-4.6-1.2z" />

        {/* Cursive "Smile" lettering */}
        <text
          x="47"
          y="37"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontFamily="'Caveat', 'Playpen Sans', 'Comic Sans MS', cursive, sans-serif"
          fontWeight="bold"
          fontSize="23"
          letterSpacing="0.5px"
        >
          Smile
        </text>

        {/* Tiny heart accent above the 'i' */}
        <path
          d="M48.5 23c-0.8-0.8-1.8-0.8-2.4 0-0.6 0.8 0 1.6 2.4 3 2.4-1.4 3-2.2 2.4-3-0.6-0.8-1.6-0.8-2.4 0z"
          fill={accentColor}
          stroke="none"
        />
      </svg>
    );
  }

  if (variant === "lens") {
    // Bold hand-drawn block lettering "LENS" from reference image
    return (
      <svg
        viewBox="0 0 80 40"
        width={size}
        height={(size * 40) / 80}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`doodle-svg doodle-typography-lens ${isPopping ? "is-popping" : ""} ${className}`}
        aria-hidden="true"
        {...props}
      >
        <g strokeWidth="2.4" fill="currentColor">
          {/* L */}
          <path d="M14 10v20h12v-4H18v-16z" />
          {/* E */}
          <path d="M30 10v20h12v-4H34v-4h7v-4h-7v-4h8v-4z" />
          {/* N */}
          <path d="M46 10v20h4l8-14v14h4V10h-4l-8 14V10z" />
          {/* S */}
          <path d="M66 14h8v4h-6c-1 0-2 0.8-2 1.8v1.4c0 1 1 1.8 2 1.8h5c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4h-9v-4h7c0.8 0 1.5-0.6 1.5-1.5v-1c0-0.9-0.7-1.5-1.5-1.5h-5c-2.2 0-4-1.8-4-4v-2c0-2.2 1.8-4 4-4z" />
        </g>
      </svg>
    );
  }

  if (variant === "fullframe") {
    // Bold hand-drawn lettering "FULL FRAME" from reference image
    return (
      <svg
        viewBox="0 0 92 46"
        width={size}
        height={(size * 46) / 92}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`doodle-svg doodle-typography-fullframe ${isPopping ? "is-popping" : ""} ${className}`}
        aria-hidden="true"
        {...props}
      >
        <text
          x="46"
          y="20"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontFamily="'Outfit', Impact, sans-serif"
          fontWeight="900"
          fontSize="16"
          letterSpacing="1px"
        >
          FULL
        </text>
        <text
          x="46"
          y="38"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontFamily="'Outfit', Impact, sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="1px"
        >
          FRAME
        </text>
      </svg>
    );
  }

  // Default "CLICK IT!" speech bubble from reference image
  return (
    <svg
      viewBox="0 0 84 84"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-speech-click ${isPopping ? "is-popping" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Round bubble with downward-pointing tail */}
      <path d="M42 68c-15.5 0-28-11.6-28-26S26.5 16 42 16s28 11.6 28 26c0 6.2-2.3 12-6.2 16.5L66 76l-14-4.8c-3.2 1.8-6.6 2.8-10 2.8z" />

      {/* Bold hand-lettered "CLICK IT!" */}
      <text
        x="42"
        y="38"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="'Impact', 'Arial Black', sans-serif"
        fontWeight="bold"
        fontSize="15"
        letterSpacing="0.8px"
      >
        CLICK
      </text>
      <text
        x="42"
        y="55"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="'Impact', 'Arial Black', sans-serif"
        fontWeight="bold"
        fontSize="16"
        letterSpacing="1px"
      >
        IT!
      </text>

      {/* Small accent sparkle or dot */}
      <circle cx="61" cy="24" r="1.5" fill={accentColor} stroke="none" />
    </svg>
  );
}
