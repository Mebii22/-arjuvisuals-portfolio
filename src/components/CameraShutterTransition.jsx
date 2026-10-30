import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getRouteTitle } from "../utils/routeTitles";

/**
 * Minimal, Silky-Smooth Page Transition & Loader for ArjuVisuals.co
 * - Synchronously activates on route change before browser paint (zero flash).
 * - Calibrated ~520ms duration: ~280ms hairline sweep + ~220ms luxury dissolve.
 * - Shows refined brand mark & contextual destination title.
 */
export default function CameraShutterTransition() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Track path to detect route changes synchronously during render (eliminates paint flashes)
  const [lastPath, setLastPath] = useState(currentPath);
  const [isActive, setIsActive] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [subtitle, setSubtitle] = useState(() => {
    return currentPath === "/" ? "PHOTOGRAPHY · VISUAL DIRECTION" : getRouteTitle(currentPath);
  });

  const timersRef = useRef([]);
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Synchronous route-change detection during render
  if (currentPath !== lastPath) {
    setLastPath(currentPath);
    setIsActive(true);
    setIsExiting(false);
    setProgress(0);
    setSubtitle(currentPath === "/" ? "PHOTOGRAPHY · VISUAL DIRECTION" : getRouteTitle(currentPath));
  }

  // Handle animation sequence
  useEffect(() => {
    if (!isActive) return;

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      setIsActive(false);
      return;
    }

    clearTimers();

    // 1. Hairline line smoothly glides 0% -> 100% (~280ms)
    const tProgress = setTimeout(() => {
      setProgress(100);
    }, 30);

    // 2. Micro completion hold, then smooth dissolve exit (~220ms)
    const tExit = setTimeout(() => {
      setIsExiting(true);
    }, 300);

    // 3. Fully completed and unmounted (~520ms total)
    const tDone = setTimeout(() => {
      setIsActive(false);
      setIsExiting(false);
      setProgress(0);
    }, 520);

    timersRef.current = [tProgress, tExit, tDone];

    return clearTimers;
  }, [lastPath, isActive]);

  if (!isActive) return null;

  return (
    <aside
      className={`av-minimal-loader ${isExiting ? "is-exiting" : ""}`}
      aria-label="Loading page"
      aria-hidden={isExiting}
    >
      <div className="av-minimal-loader-content">
        <div className="av-loader-brand">
          <span className="av-loader-title">
            ARJUVISUALS<span className="av-loader-dot">.CO</span>
          </span>
          <span className="av-loader-subtitle">{subtitle}</span>
        </div>

        <div className="av-loader-line-track">
          <div
            className="av-loader-line-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
