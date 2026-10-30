import React from "react";

export default function StarDoodle({
  className = "",
  size = 36,
  variant = "star", // "star" | "sparkle" | "double"
  accentColor = "var(--deep-red)",
  isTwinkling = false,
  ...props
}) {
  if (variant === "sparkle") {
    return (
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`doodle-svg doodle-sparkle ${isTwinkling ? "is-twinkling" : ""} ${className}`}
        aria-hidden="true"
        {...props}
      >
        <path d="M24 4c2 11 9 18 20 20-11 2-18 9-20 20-2-11-9-18-20-20 11-2 18-9 20-20z" />
        <circle cx="24" cy="24" r="1.5" fill={accentColor} stroke="none" />
      </svg>
    );
  }

  if (variant === "double") {
    return (
      <svg
        viewBox="0 0 54 54"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`doodle-svg doodle-sparkle-double ${isTwinkling ? "is-twinkling" : ""} ${className}`}
        aria-hidden="true"
        {...props}
      >
        <path d="M24 6c1.5 9 7 15 16 16-9 1.5-15 7-16 16-1.5-9-7-15-16-16 9-1.5 15-7 16-16z" />
        <path
          d="M40 32c1 5 4 8 8 9-4 1-8 4-9 8-1-5-4-8-8-9 4-1 8-4 9-8z"
          strokeWidth="1.6"
          opacity="0.8"
        />
      </svg>
    );
  }

  // Default hand-drawn 5-point sketch star from reference image
  return (
    <svg
      viewBox="0 0 50 50"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle-svg doodle-star ${isTwinkling ? "is-twinkling" : ""} ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M25 5l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2 6-12z" />
      <circle cx="25" cy="26" r="1.2" fill={accentColor} stroke="none" opacity="0.8" />
    </svg>
  );
}
