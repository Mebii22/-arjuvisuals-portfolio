import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  playShutterSound,
  playChirpSound,
  playFocusBeepSound,
  playFilmAdvanceSound,
  playPopSound,
  playTwinkleSound,
  playDialTickSound,
  playCelebrationSound,
  getIsMuted,
  toggleMute,
} from "./audio";

// Curated 6 mini Polaroid collectible snapshot themes celebrating Arjun's Kerala craft
const THEMES = [
  { id: "kerala", label: "KERALA • 01", sub: "Alappuzha" },
  { id: "camera", label: "ARJU • 02", sub: "Vintage TLR" },
  { id: "mountain", label: "WAYANAD • 03", sub: "Misty Peaks" },
  { id: "kathakali", label: "THRISSUR • 04", sub: "Kathakali" },
  { id: "sunset", label: "VARKALA • 05", sub: "Cliff Sunset" },
  { id: "heart", label: "PERFECT • 06", sub: "Wedding Vows" },
];

function MiniPolaroidArt({ themeId }) {
  if (themeId === "camera") {
    return (
      <svg viewBox="0 0 32 24" width="32" height="24" fill="none">
        <rect width="32" height="24" fill="var(--stone)" rx="2" />
        <rect x="5" y="4" width="22" height="16" rx="3" stroke="var(--dark-red)" strokeWidth="1.3" />
        <circle cx="16" cy="12" r="4.6" stroke="var(--deep-red)" strokeWidth="1.3" />
        <circle cx="16" cy="12" r="2" fill="var(--deep-red)" />
        <circle cx="14.8" cy="10.8" r="0.7" fill="#ffffff" />
        <rect x="8" y="2" width="4" height="2" fill="var(--dark-red)" rx="0.5" />
      </svg>
    );
  }

  if (themeId === "mountain") {
    return (
      <svg viewBox="0 0 32 24" width="32" height="24" fill="none">
        <rect width="32" height="24" fill="var(--stone)" rx="2" />
        <circle cx="23" cy="6.5" r="3" fill="var(--deep-red)" opacity="0.85" />
        <path d="M2 21l7-10 6 7 5-5 10 8H2z" fill="var(--dark-red)" opacity="0.35" />
        <path d="M7 21l7-9 6 6 4-4 6 7H7z" stroke="var(--dark-red)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M5 6c1-1 2 0 3-1" stroke="var(--deep-red)" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (themeId === "kathakali") {
    return (
      <svg viewBox="0 0 32 24" width="32" height="24" fill="none">
        <rect width="32" height="24" fill="var(--stone)" rx="2" />
        <path d="M16 2.5l5 6h-10l5-6z" fill="var(--deep-red)" stroke="var(--dark-red)" strokeWidth="0.8" />
        <circle cx="16" cy="13.5" r="5.5" stroke="var(--dark-red)" strokeWidth="1.1" />
        <path d="M13 12.5c1-1 2 0 2 0" stroke="var(--dark-red)" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M17 12.5c1 0 2-1 2 0" stroke="var(--dark-red)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="14" cy="13.2" r="0.8" fill="var(--deep-red)" />
        <circle cx="18" cy="13.2" r="0.8" fill="var(--deep-red)" />
        <path d="M14.5 16.5c1 1 2 1 3 0" stroke="var(--deep-red)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  if (themeId === "sunset") {
    return (
      <svg viewBox="0 0 32 24" width="32" height="24" fill="none">
        <rect width="32" height="24" fill="var(--stone)" rx="2" />
        <circle cx="16" cy="12" r="4.5" fill="var(--deep-red)" opacity="0.9" />
        <path d="M2 13h28" stroke="var(--dark-red)" strokeWidth="1.1" />
        <path d="M4 16h24" stroke="var(--dark-red)" strokeWidth="0.8" opacity="0.7" />
        <path d="M7 19h18" stroke="var(--dark-red)" strokeWidth="0.8" opacity="0.5" />
        <path d="M2 9c3 3 5 8 5 12H2V9z" fill="var(--dark-red)" opacity="0.8" />
      </svg>
    );
  }

  if (themeId === "heart") {
    return (
      <svg viewBox="0 0 32 24" width="32" height="24" fill="none">
        <rect width="32" height="24" fill="var(--stone)" rx="2" />
        <circle cx="13" cy="13" r="4" stroke="var(--dark-red)" strokeWidth="1.2" />
        <circle cx="19" cy="13" r="4" stroke="var(--dark-red)" strokeWidth="1.2" />
        <path
          d="M16 8.5s-2.8-1.8-2.8-3.4c0-1 .8-1.8 1.8-1.8.6 0 1 .3 1 .6.1-.3.5-.6 1-.6 1 0 1.8.8 1.8 1.8 0 1.6-2.8 3.4-2.8 3.4z"
          fill="var(--deep-red)"
        />
      </svg>
    );
  }

  // Default: Kerala palms & backwaters
  return (
    <svg viewBox="0 0 32 24" width="32" height="24" fill="none">
      <rect width="32" height="24" fill="var(--stone)" rx="2" />
      <circle cx="23" cy="6.5" r="3" fill="var(--deep-red)" opacity="0.85" />
      <path d="M8 22c2-5 5-9 10-10.5" stroke="var(--dark-red)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M18 11.5c-3.6-2.2-7.5-1.2-9.5 1" stroke="var(--dark-red)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M18 11.5c0-3.6 3.6-5.8 6.2-4.6" stroke="var(--dark-red)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M18 11.5c3.6-1.1 7 1.4 8.2 4.6" stroke="var(--dark-red)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M4 20c4-1 8 0 12-1 4 1 8 0 12-1" stroke="var(--dark-red)" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

export default function InteractiveDoodle({
  children,
  type = "camera", // "camera" | "lens" | "bird" | "star" | "heart" | "click" | "smile" | "film" | "deco"
  interactive = true,
  animateOnScroll = true,
  float = true,
  floatType = "gentle", // "gentle" | "drift" | "wave" | "sway"
  floatDelay = 0,
  floatDuration = 7.2,
  sound = true,
  className = "",
  style = {},
  label = "",
  onClick,
  ...props
}) {
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [flashHalo, setFlashHalo] = useState(false);
  const [focusLocked, setFocusLocked] = useState(false);
  const [exposureCount, setExposureCount] = useState(1);
  const [isFilmPulling, setIsFilmPulling] = useState(false);
  const [particles, setParticles] = useState([]);
  const [muted, setMutedState] = useState(false);
  const elRef = useRef(null);
  const timersRef = useRef([]);

  // Clear pending timeouts on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const addTimer = (fn, delay) => {
    const id = setTimeout(() => {
      fn();
      timersRef.current = timersRef.current.filter((t) => t !== id);
    }, delay);
    timersRef.current.push(id);
    return id;
  };

  // Sync mute state on mount
  useEffect(() => {
    setMutedState(getIsMuted());
  }, []);

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = toggleMute();
    setMutedState(nextMuted);
  };

  // Viewport intersection for natural entrance
  useEffect(() => {
    if (!animateOnScroll) {
      setInView(true);
      return;
    }
    const node = elRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOnScroll]);

  // High-performance 3D tilt tracking using CSS custom variables (ZERO React re-renders)
  const handleMouseMove = (e) => {
    if (!interactive) return;
    const node = elRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const tiltX = (py - 0.5) * -12;
    const tiltY = (px - 0.5) * 12;
    node.style.setProperty("--tilt-x", `${tiltX.toFixed(1)}deg`);
    node.style.setProperty("--tilt-y", `${tiltY.toFixed(1)}deg`);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    if (sound) {
      if (type === "camera") {
        playDialTickSound();
      } else if (type === "lens") {
        playFocusBeepSound();
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    const node = elRef.current;
    if (node) {
      node.style.setProperty("--tilt-x", "0deg");
      node.style.setProperty("--tilt-y", "0deg");
    }
  };

  const handleMouseDown = () => {
    if (!interactive) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!interactive) return;
    setIsPressed(false);
  };

  // Click / Tap interaction trigger
  const triggerInteraction = useCallback(
    (e) => {
      if (!interactive) return;

      setActive(true);
      const now = Date.now();

      if (type === "camera") {
        setFlashHalo(true);
        if (sound) playShutterSound();
        addTimer(() => setFlashHalo(false), 240);

        const currentTheme = THEMES[(exposureCount - 1) % THEMES.length];
        const nextCount = (exposureCount % 36) + 1;
        setExposureCount(nextCount);

        // Easter egg celebration when completing a full 36-shot film roll
        if (nextCount === 1 && exposureCount === 36) {
          if (sound) playCelebrationSound();
          setParticles([
            {
              id: now + 1,
              type: "badge",
              text: "🌟 FILM ROLL COMPLETE! 36/36 🎞️",
              dx: 0,
              dy: -56,
              rot: -2,
            },
            { id: now + 2, type: "sparkle", dx: -40, dy: -40, rot: 30 },
            { id: now + 3, type: "sparkle", dx: 40, dy: -40, rot: -30 },
          ]);
          addTimer(() => setParticles([]), 2800);
        } else {
          // Eject collectible Polaroid snapshot
          setParticles([
            {
              id: now + 1,
              type: "snapshot",
              themeId: currentTheme.id,
              themeLabel: currentTheme.label,
              themeSub: currentTheme.sub,
              dx: 0,
              dy: -34,
              rot: -3,
            },
            { id: now + 2, type: "sparkle", dx: -36, dy: -34, rot: 25 },
            { id: now + 3, type: "sparkle", dx: 36, dy: -34, rot: -25 },
          ]);
          addTimer(() => setParticles([]), 2300);
        }
        addTimer(() => setActive(false), 320);
      } else if (type === "click") {
        setFlashHalo(true);
        if (sound) {
          playPopSound();
          playShutterSound();
        }
        addTimer(() => setFlashHalo(false), 240);

        const badges = [
          "PERFECT! ✨",
          "NICE SHOT! 📸",
          "EXCELLENT! 🎯",
          "SO CREATIVE! 🎨",
          "LOVE IT! ❤️",
          "BEAUTIFUL! 💖",
        ];
        const chosenBadge = badges[Math.floor(Math.random() * badges.length)];

        setParticles([
          { id: now + 1, type: "badge", text: chosenBadge, dx: 0, dy: -48, rot: -2 },
          { id: now + 2, type: "sparkle", dx: -30, dy: -26, rot: 20 },
          { id: now + 3, type: "sparkle", dx: 30, dy: -26, rot: -20 },
        ]);
        addTimer(() => setParticles([]), 1800);
        addTimer(() => setActive(false), 320);
      } else if (type === "bird") {
        if (sound) playChirpSound();
        setParticles([
          { id: now + 1, type: "note", symbol: "♪", dx: -20, dy: -44, rot: -12 },
          { id: now + 2, type: "note", symbol: "♫", dx: 20, dy: -50, rot: 14 },
          { id: now + 3, type: "heart", dx: 0, dy: -60, rot: 5 },
        ]);
        addTimer(() => setParticles([]), 1800);
        addTimer(() => setActive(false), 440);
      } else if (type === "lens") {
        if (sound) playFocusBeepSound();
        setFocusLocked(true);
        setParticles([
          { id: now + 1, type: "sparkle", dx: -26, dy: -26, rot: 45 },
          { id: now + 2, type: "sparkle", dx: 26, dy: -26, rot: -45 },
        ]);
        addTimer(() => setFocusLocked(false), 850);
        addTimer(() => setParticles([]), 1400);
        addTimer(() => setActive(false), 400);
      } else if (type === "film") {
        if (sound) playFilmAdvanceSound();
        setIsFilmPulling(true);
        setParticles([
          { id: now + 1, type: "badge", text: "ISO 400 🎞️", dx: 0, dy: -44, rot: -2 },
          { id: now + 2, type: "sparkle", dx: -24, dy: -22, rot: 15 },
          { id: now + 3, type: "sparkle", dx: 24, dy: -22, rot: -15 },
        ]);
        addTimer(() => setIsFilmPulling(false), 1500);
        addTimer(() => setParticles([]), 1800);
        addTimer(() => setActive(false), 340);
      } else if (type === "smile" || type === "heart") {
        if (sound) playPopSound();
        setParticles([
          { id: now + 1, type: "heart", dx: -18, dy: -44, rot: -10 },
          { id: now + 2, type: "heart", dx: 18, dy: -50, rot: 12 },
          { id: now + 3, type: "sparkle", dx: 0, dy: -58, rot: 0 },
        ]);
        addTimer(() => setParticles([]), 1800);
        addTimer(() => setActive(false), 340);
      } else if (type === "star") {
        if (sound) playTwinkleSound();
        setParticles([
          { id: now + 1, type: "sparkle", dx: -24, dy: -30, rot: 45 },
          { id: now + 2, type: "sparkle", dx: 24, dy: -30, rot: -45 },
        ]);
        addTimer(() => setParticles([]), 1400);
        addTimer(() => setActive(false), 300);
      } else {
        addTimer(() => setActive(false), 300);
      }

      if (onClick) onClick(e);
    },
    [interactive, type, sound, exposureCount, onClick]
  );

  const handleKeyDown = (e) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerInteraction(e);
    }
  };

  // Only pass type-relevant state prop to avoid leaking unused props to SVG DOM elements
  const childProps = {};
  if (type === "camera" || type === "click") {
    childProps.isSnapping = (active || isHovered || isPressed);
  } else if (type === "lens") {
    childProps.isFocused = (active || isHovered || focusLocked);
  } else if (type === "bird") {
    childProps.isChirping = (active || isHovered);
  } else if (type === "heart") {
    childProps.isPulsing = (active || isHovered);
  } else if (type === "star") {
    childProps.isTwinkling = (active || isHovered);
  } else if (type === "smile") {
    childProps.isPopping = (active || isHovered);
  } else if (type === "film") {
    childProps.isUnrolling = (active || isHovered || isFilmPulling);
  }

  const renderedChild = React.isValidElement(children)
    ? React.cloneElement(children, childProps)
    : children;

  const getAriaLabel = () => {
    if (label) return label;
    if (!interactive) return undefined;
    switch (type) {
      case "camera":
        return `Interactive camera doodle — shot ${exposureCount} of 36, click to snap`;
      case "lens":
        return "Interactive camera lens doodle — click to lock autofocus";
      case "bird":
        return "Camera birdie doodle — click for cheerful chirp";
      case "click":
        return "Click it speech doodle — snap snapshot";
      case "smile":
        return "Smile doodle — click for love";
      case "heart":
        return "Love photography frame doodle";
      case "star":
        return "Twinkling star doodle";
      case "film":
        return "35mm film canister — click to advance";
      default:
        return "Interactive photography doodle";
    }
  };

  return (
    <div
      ref={elRef}
      className={`interactive-doodle-wrap type-${type} ${
        inView ? "is-drawn" : "is-hidden"
      } ${interactive ? "is-interactive" : ""} ${className}`}
      style={style}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={getAriaLabel()}
      onClick={triggerInteraction}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      {...props}
    >
      {/* SEPARATED FLOAT LAYER: Independent multi-axis float animation */}
      <div
        className={`doodle-float-container float-${floatType} ${float ? "is-floating" : ""}`}
        style={{
          "--float-delay": `${floatDelay}s`,
          "--float-dur": `${floatDuration}s`,
        }}
      >
        {/* TACTILE SPRING CARD: Handles hover scale, active snap, 3D tilt */}
        <div
          className={`doodle-spring-card ${active ? "is-active" : ""} ${
            isPressed ? "is-pressed" : ""
          } ${isHovered ? "is-hovered" : ""} ${focusLocked ? "is-focus-locked" : ""}`}
        >
          {/* Visual shutter flash halo effect */}
          {flashHalo && <span className="doodle-shutter-flash" aria-hidden="true" />}

          {/* Camera Viewfinder Digital HUD Badge on Hover */}
          {type === "camera" && (
            <div className={`doodle-cam-hud ${isHovered ? "is-active" : ""}`} aria-hidden="true">
              <span className="hud-pill">RAW • ISO 100</span>
              <span className="hud-pill exp">EXP {String(exposureCount).padStart(2, "0")}/36</span>
              <button
                type="button"
                className="hud-pill hud-pill-mute"
                onClick={handleToggleMute}
                title={muted ? "Unmute audio" : "Mute audio"}
                aria-label={muted ? "Unmute audio" : "Mute audio"}
              >
                {muted ? "🔇" : "🔊"}
              </button>
            </div>
          )}

          {/* Camera Autofocus targeting reticle on Lens */}
          {type === "lens" && (
            <div
              className={`doodle-af-reticle ${focusLocked ? "is-locked" : isHovered ? "is-hover" : ""}`}
              aria-hidden="true"
            >
              <span className="af-bracket af-tl" />
              <span className="af-bracket af-tr" />
              <span className="af-bracket af-bl" />
              <span className="af-bracket af-br" />
              <span className="af-label">{focusLocked ? "AF-LOCK • 50mm f/1.4" : "AF-ON [ + ]"}</span>
            </div>
          )}

          {/* Interactive dynamic particles (Polaroid collectibles, musical notes, hearts, sparkles, badges) */}
          {particles.map((p) => {
            if (p.type === "snapshot") {
              return (
                <div
                  key={p.id}
                  className="doodle-particle particle-snapshot"
                  style={{
                    "--p-dx": `${p.dx}px`,
                    "--p-dy": `${p.dy}px`,
                    "--p-rot": `${p.rot}deg`,
                  }}
                  aria-hidden="true"
                >
                  <div className="mini-snapshot-card">
                    <div className="mini-photo-inner">
                      <MiniPolaroidArt themeId={p.themeId} />
                    </div>
                    <div className="mini-snapshot-text">
                      <span className="mini-snapshot-label">{p.themeLabel}</span>
                      {p.themeSub && <span className="mini-snapshot-sub">{p.themeSub}</span>}
                    </div>
                  </div>
                </div>
              );
            }

            if (p.type === "badge") {
              return (
                <div
                  key={p.id}
                  className="doodle-particle particle-badge"
                  style={{
                    "--p-dx": `${p.dx}px`,
                    "--p-dy": `${p.dy}px`,
                    "--p-rot": `${p.rot}deg`,
                  }}
                  aria-hidden="true"
                >
                  <span>{p.text}</span>
                </div>
              );
            }

            if (p.type === "note") {
              return (
                <div
                  key={p.id}
                  className="doodle-particle particle-note"
                  style={{
                    "--p-dx": `${p.dx}px`,
                    "--p-dy": `${p.dy}px`,
                    "--p-rot": `${p.rot}deg`,
                  }}
                  aria-hidden="true"
                >
                  <span>{p.symbol}</span>
                </div>
              );
            }

            if (p.type === "heart") {
              return (
                <div
                  key={p.id}
                  className="doodle-particle particle-heart"
                  style={{
                    "--p-dx": `${p.dx}px`,
                    "--p-dy": `${p.dy}px`,
                    "--p-rot": `${p.rot}deg`,
                  }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="var(--deep-red)">
                    <path d="M8 14s-6-3.8-6-7.5C2 3.8 4 2 6 2c1.2 0 2 0.7 2 1.2C8.8 2.7 9.6 2 10.8 2 12.8 2 14.8 3.8 14 6.5 14 10.2 8 14 8 14z" />
                  </svg>
                </div>
              );
            }

            // Default sparkle particle
            return (
              <div
                key={p.id}
                className="doodle-particle particle-sparkle"
                style={{
                  "--p-dx": `${p.dx}px`,
                  "--p-dy": `${p.dy}px`,
                  "--p-rot": `${p.rot}deg`,
                }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M8 0c.5 4 4 7.5 8 8-4 .5-7.5 4-8 8-.5-4-4-7.5-8-8 4-.5 7.5-4 8-8z" />
                </svg>
              </div>
            );
          })}

          {/* The doodle graphic component */}
          <div className="interactive-doodle-body">{renderedChild}</div>
        </div>
      </div>
    </div>
  );
}
