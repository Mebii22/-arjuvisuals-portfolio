import { useEffect, useRef, useState } from "react";

// 6 Iris blades rotated at 0°, 60°, 120°, 180°, 240°, 300°
const BLADE_ANGLES = [0, 60, 120, 180, 240, 300];

export default function Cursor() {
  const pointerRef = useRef(null);
  const followerRef = useRef(null);
  const apertureGroupRef = useRef(null);

  const pos = useRef({ x: -100, y: -100 });
  const follower = useRef({ x: -100, y: -100 });
  const lastPos = useRef({ x: -100, y: -100 });
  const tiltRef = useRef(0);
  const targetTiltRef = useRef(0);
  const irisScaleRef = useRef(1);
  const targetIrisScaleRef = useRef(1);

  const [mode, setMode] = useState("default");
  // "default" | "interactive" | "viewProject" | "viewPhoto" | "focus" | "brand" | "text"
  const [isPressed, setIsPressed] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return undefined;

    setOn(true);
    document.documentElement.classList.add("has-camera-cursor");

    // 1. Instantaneous 0ms pointer tracking with organic physical tilt
    const onMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastPos.current.x >= 0 && !reduce) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Stabilized directional tilt (max ±9°) — organic lens inertia, zero infinite spinning
        targetTiltRef.current = Math.max(-9, Math.min(9, dx * 0.65));

        // Velocity-based f-stop breathing: wide open at rest (1.0), subtly stops down during fast tracking (0.94)
        targetIrisScaleRef.current = Math.max(0.94, 1 - Math.min(speed, 30) * 0.002);
      }

      pos.current = { x, y };
      lastPos.current = { x, y };

      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    // 2. Intelligent semantic interaction detection
    const onMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      // Check if hovering over editable text inputs/textareas/selects
      const textInput = target.closest(
        "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']):not([type='file']), textarea, select, [contenteditable='true']"
      );
      if (textInput) {
        setMode("text");
        return;
      }

      const t = target.closest(
        "a, button, [data-cursor], .project-card, .ig-tile, .service-card, .filter-btn, .combo-orb, .wordmark, .name-chip, .photo-ring, .spot-card, label, summary, [role='button'], .admin-side .brand, .photo-admin-grid figure, .photo-admin-grid img, .admin-table td img, .admin-menu-btn, .badge-btn, .upload-btn, .admin-card button, .pill, input[type='checkbox'], input[type='radio'], input[type='file'], input[type='submit'], input[type='button']"
      );

      if (!t) {
        setMode("default");
        return;
      }

      // Check explicit data-cursor attribute first
      const attr = t.getAttribute("data-cursor");
      if (attr === "project") {
        setMode("viewProject");
        return;
      }
      if (attr === "photo") {
        setMode("viewPhoto");
        return;
      }
      if (attr === "brand") {
        setMode("brand");
        return;
      }
      if (attr === "focus") {
        setMode("focus");
        return;
      }
      if (attr === "view") {
        if (
          t.classList.contains("project-card") ||
          t.closest(".project-card") ||
          t.getAttribute("href")?.includes("/portfolio/")
        ) {
          setMode("viewProject");
        } else {
          setMode("viewPhoto");
        }
        return;
      }

      // Semantic class detection
      if (
        t.classList.contains("project-card") ||
        t.closest(".project-card") ||
        t.getAttribute("href")?.includes("/portfolio/")
      ) {
        setMode("viewProject");
        return;
      }
      if (
        t.classList.contains("ig-tile") ||
        t.closest(".ig-tile") ||
        t.closest(".gallery-stack") ||
        t.classList.contains("photo-ring") ||
        t.classList.contains("photo-admin-grid") ||
        t.closest(".photo-admin-grid figure") ||
        t.closest(".admin-table td img")
      ) {
        setMode("viewPhoto");
        return;
      }
      if (
        t.classList.contains("wordmark") ||
        t.closest(".wordmark") ||
        t.classList.contains("name-chip") ||
        t.closest(".name-chip") ||
        t.classList.contains("brand") ||
        t.closest(".admin-side .brand")
      ) {
        setMode("brand");
        return;
      }

      // Generic interactive elements (buttons, links, labels, admin controls)
      setMode("interactive");
    };

    // 3. Tactile mechanical shutter click
    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    // 4. Viewport entry/exit detection
    const onMouseLeave = () => setIsOffscreen(true);
    const onMouseEnter = () => setIsOffscreen(false);

    // 5. Smooth physics animation loop
    let raf;
    const loop = () => {
      // Follower tracks with spring physics (damping 0.22)
      follower.current.x += (pos.current.x - follower.current.x) * 0.22;
      follower.current.y += (pos.current.y - follower.current.y) * 0.22;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${follower.current.x.toFixed(1)}px, ${follower.current.y.toFixed(1)}px, 0)`;
      }

      // Smooth tilt and iris breathing decay
      if (!reduce) {
        tiltRef.current += (targetTiltRef.current - tiltRef.current) * 0.16;
        targetTiltRef.current *= 0.88; // gently decays to 0° when resting

        irisScaleRef.current += (targetIrisScaleRef.current - irisScaleRef.current) * 0.16;
        targetIrisScaleRef.current += (1 - targetIrisScaleRef.current) * 0.08; // gently returns to 1.0

        if (apertureGroupRef.current) {
          apertureGroupRef.current.style.transform = `rotate(${tiltRef.current.toFixed(2)}deg) scale(${irisScaleRef.current.toFixed(3)})`;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("has-camera-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!on) return null;

  const isFocusMode = mode === "viewProject" || mode === "viewPhoto" || mode === "focus";
  const isBrandMode = mode === "brand";

  return (
    <div
      className={`av-camera-cursor-root mode-${mode} ${isPressed ? "is-pressed" : ""} ${
        isOffscreen ? "is-offscreen" : ""
      }`}
      aria-hidden="true"
    >
      {/* 1. Trailing Follower Frame (Viewfinder Reticle / Outer Focus Ring) */}
      <div ref={followerRef} className="av-cursor-follower">
        {isFocusMode ? (
          /* Camera Viewfinder Focus Reticle (4 Corner Brackets + Central AF marks) */
          <div className="av-viewfinder-reticle">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className="viewfinder-svg">
              {/* 4 Viewfinder Corner Brackets */}
              <path d="M 3 13 L 3 3 L 13 3" className="vf-bracket vf-tl" />
              <path d="M 39 3 L 49 3 L 49 13" className="vf-bracket vf-tr" />
              <path d="M 3 39 L 3 49 L 13 49" className="vf-bracket vf-bl" />
              <path d="M 39 49 L 49 49 L 49 39" className="vf-bracket vf-br" />

              {/* Viewfinder Rule-of-Thirds Micro Ticks */}
              <line x1="18" y1="3" x2="18" y2="5.5" className="vf-tick" />
              <line x1="34" y1="3" x2="34" y2="5.5" className="vf-tick" />
              <line x1="18" y1="46.5" x2="18" y2="49" className="vf-tick" />
              <line x1="34" y1="46.5" x2="34" y2="49" className="vf-tick" />

              {/* Center AF Focus Point */}
              <line x1="19" y1="26" x2="22" y2="26" className="vf-af-cross" />
              <line x1="30" y1="26" x2="33" y2="26" className="vf-af-cross" />
              <line x1="26" y1="19" x2="26" y2="22" className="vf-af-cross" />
              <line x1="26" y1="30" x2="26" y2="33" className="vf-af-cross" />
              <circle cx="26" cy="26" r="1.3" className="vf-center-dot" />
            </svg>

            {/* Refined Photographic View Label */}
            <div className="vf-label-pill">
              <span className="vf-label-dot" />
              <span className="vf-label-text">
                {mode === "viewProject"
                  ? "VIEW PROJECT"
                  : mode === "viewPhoto"
                  ? "VIEW PHOTO"
                  : "FOCUS"}
              </span>
            </div>
          </div>
        ) : isBrandMode ? (
          /* Signature AV Monogram Reticle */
          <div className="av-brand-reticle">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="brand-reticle-svg">
              <circle cx="20" cy="20" r="18.5" className="brand-outer-ring" />
              <line x1="20" y1="0.5" x2="20" y2="3.5" className="brand-index-tick" />
              <line x1="20" y1="36.5" x2="20" y2="39.5" className="brand-index-tick" />
            </svg>
            <div className="brand-label-pill">
              <span className="brand-label-text">AV · SIGNATURE</span>
            </div>
          </div>
        ) : (
          /* Subtle Ambient Outer Lens Focus Ring (follows close, no detachment) */
          <div className="av-aperture-outer-ring">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" className="aperture-outer-svg">
              <circle cx="19" cy="19" r="17.2" className="lens-barrel-circle" />
              <line x1="19" y1="0.5" x2="19" y2="3" className="lens-tick" />
              <line x1="19" y1="35" x2="19" y2="37.5" className="lens-tick" />
              <line x1="0.5" y1="19" x2="3" y2="19" className="lens-tick" />
              <line x1="35" y1="19" x2="37.5" y2="19" className="lens-tick" />
            </svg>
          </div>
        )}
      </div>

      {/* 2. Direct 0ms Precision Pointer (Aperture / Monogram / Focus Aim) */}
      <div ref={pointerRef} className="av-cursor-pointer">
        {isBrandMode ? (
          /* Signature AV Monogram Glyphs */
          <div className="av-monogram-symbol">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="av-monogram-svg">
              <circle cx="16" cy="16" r="14" className="monogram-disc" />
              <path d="M 10 22.5 L 16 9 L 22 22.5" className="monogram-stroke stroke-a" />
              <line x1="12.5" y1="18" x2="19.5" y2="18" className="monogram-bar" />
              <path d="M 16 9 L 20 18 L 16 23 L 12 18" className="monogram-stroke stroke-v" />
              <circle cx="16" cy="16" r="1.2" className="monogram-core-dot" />
            </svg>
          </div>
        ) : isFocusMode ? (
          /* Focus Center Micro Reticle (Instant pixel aiming) */
          <div className="av-focus-center-dot" />
        ) : (
          /* Authentic 6-Blade Camera Aperture Iris with Central Hexagonal F-Stop Opening */
          <div className="av-aperture-symbol">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="camera-aperture-svg">
              {/* Outer Lens Bezel Frame */}
              <circle cx="16" cy="16" r="14" className="aperture-bezel" />

              {/* 4 Precision Lens Barrel Index Markings */}
              <line x1="16" y1="0.8" x2="16" y2="2.5" className="aperture-lens-index" />
              <line x1="29.5" y1="16" x2="31.2" y2="16" className="aperture-lens-index" />
              <line x1="16" y1="29.5" x2="16" y2="31.2" className="aperture-lens-index" />
              <line x1="0.8" y1="16" x2="2.5" y2="16" className="aperture-lens-index" />

              {/* Stabilized 6-Blade Overlapping Iris Mechanism (breathing f-stop & subtle tilt) */}
              <g ref={apertureGroupRef} className="aperture-blades-group" style={{ transformOrigin: "16px 16px" }}>
                {BLADE_ANGLES.map((angle) => (
                  <g key={angle} transform={`rotate(${angle} 16 16)`}>
                    {/* Mathematically precise camera iris blade: outer arc + tangent cutting chord + clean overlapping segment */}
                    <path
                      d="M 13.58 11.8 L 28.83 11.8 A 13.5 13.5 0 0 1 26.05 25.01 L 18.43 11.8 Z"
                      className="aperture-blade"
                    />
                  </g>
                ))}
              </g>

              {/* Central Optical Pupil Crosshairs & Precision Aim Point */}
              <line x1="16" y1="12.2" x2="16" y2="13.8" className="aperture-reticle-tick" />
              <line x1="16" y1="18.2" x2="16" y2="19.8" className="aperture-reticle-tick" />
              <line x1="12.2" y1="16" x2="13.8" y2="16" className="aperture-reticle-tick" />
              <line x1="18.2" y1="16" x2="19.8" y2="16" className="aperture-reticle-tick" />
              <circle cx="16" cy="16" r="1.1" className="aperture-reticle-dot" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
