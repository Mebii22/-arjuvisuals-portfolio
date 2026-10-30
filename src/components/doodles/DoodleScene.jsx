import React from "react";
import InteractiveDoodle from "./InteractiveDoodle";
import VintageCameraDoodle from "./VintageCameraDoodle";
import DSLRCameraDoodle from "./DSLRCameraDoodle";
import CompactCameraDoodle from "./CompactCameraDoodle";
import CameraWithFlashDoodle from "./CameraWithFlashDoodle";
import HeartFrameDoodle from "./HeartFrameDoodle";
import LensDoodle from "./LensDoodle";
import FilmStripDoodle from "./FilmStripDoodle";
import FilmRollDoodle from "./FilmRollDoodle";
import BirdDoodle from "./BirdDoodle";
import StarDoodle from "./StarDoodle";
import SpeechBubbleDoodle from "./SpeechBubbleDoodle";
import DoodlePattern from "./DoodlePattern";

export default function DoodleScene({
  variant = "hero", // "hero" | "page" | "about" | "contact" | "minimal"
  showPattern = true, // Subtle sketchbook background enabled for authentic artistic atmosphere
  className = "",
}) {
  // 1. Minimal Scene (404 Page)
  if (variant === "minimal") {
    return (
      <div className={`doodle-scene doodle-scene-minimal ${className}`} aria-hidden="false">
        {showPattern && <DoodlePattern opacity={0.045} />}
        <InteractiveDoodle
          type="camera"
          className="ds-item"
          style={{ top: "20%", right: "8%" }}
          floatType="gentle"
          floatDuration={7.6}
          floatDelay={0.2}
          label="Vintage camera doodle"
        >
          <VintageCameraDoodle size={56} />
        </InteractiveDoodle>
        <InteractiveDoodle
          type="star"
          className="ds-item"
          style={{ top: "38%", right: "18%" }}
          floatType="drift"
          floatDuration={6.4}
          floatDelay={0.8}
        >
          <StarDoodle size={22} variant="sparkle" />
        </InteractiveDoodle>
      </div>
    );
  }

  // 2. Contact Page Scene: Clean, spacious, rich with animated accents without crowding the title
  if (variant === "contact") {
    return (
      <div className={`doodle-scene doodle-scene-contact ${className}`} aria-hidden="false">
        {showPattern && <DoodlePattern opacity={0.045} />}

        {/* 1. Far Right: Love photography camera frame */}
        <InteractiveDoodle
          type="heart"
          className="ds-item ds-contact-heart"
          style={{ top: "36%", right: "6%" }}
          floatType="gentle"
          floatDuration={8.2}
          floatDelay={0.3}
          label="Love photography camera frame"
        >
          <HeartFrameDoodle size={56} />
        </InteractiveDoodle>

        {/* 2. Top-Right Opening: Camera with Flash */}
        <InteractiveDoodle
          type="camera"
          className="ds-item ds-contact-flash hide-mobile"
          style={{ top: "16%", right: "22%" }}
          floatType="drift"
          floatDuration={8.0}
          floatDelay={0.5}
          label="Camera with flash doodle"
        >
          <CameraWithFlashDoodle size={54} />
        </InteractiveDoodle>

        {/* 3. Mid-Right Channel: 35mm film canister roll */}
        <InteractiveDoodle
          type="film"
          className="ds-item ds-contact-film"
          style={{ bottom: "16%", right: "18%" }}
          floatType="drift"
          floatDuration={7.6}
          floatDelay={0.7}
          label="35mm film roll doodle"
        >
          <FilmRollDoodle size={48} />
        </InteractiveDoodle>

        {/* 4. Upper-Center Channel: "Smile" Cloud Speech Bubble (above CREATE with generous clearance) */}
        <InteractiveDoodle
          type="smile"
          className="ds-item ds-contact-smile hide-mobile"
          style={{ top: "22%", left: "34%" }}
          floatType="wave"
          floatDuration={7.4}
          floatDelay={0.9}
          label="Smile cloud doodle"
        >
          <SpeechBubbleDoodle variant="smile" size={62} />
        </InteractiveDoodle>

        {/* 5. Upper Right Sky: Delicate Star Sparkle */}
        <InteractiveDoodle
          type="star"
          className="ds-item ds-contact-star hide-mobile"
          style={{ top: "28%", right: "10%" }}
          floatType="wave"
          floatDuration={6.8}
          floatDelay={1.2}
        >
          <StarDoodle size={20} variant="sparkle" />
        </InteractiveDoodle>
      </div>
    );
  }

  // 3. About Page Scene: Scattered in negative space flanking the portrait & bio
  if (variant === "about") {
    return (
      <div className={`doodle-scene doodle-scene-about ${className}`} aria-hidden="false">
        {showPattern && <DoodlePattern opacity={0.045} />}

        {/* 1. Top center sky: Bird looking up */}
        <InteractiveDoodle
          type="bird"
          className="ds-item ds-about-bird hide-mobile"
          style={{ top: "14%", left: "38%" }}
          floatType="gentle"
          floatDuration={7.2}
          floatDelay={0.2}
          label="Camera birdie doodle"
        >
          <BirdDoodle size={48} />
        </InteractiveDoodle>

        {/* 2. Top right: Focus lens */}
        <InteractiveDoodle
          type="lens"
          className="ds-item ds-about-lens"
          style={{ top: "16%", right: "5%" }}
          floatType="wave"
          floatDuration={8.4}
          floatDelay={0.6}
          label="Camera lens focus doodle"
        >
          <LensDoodle size={52} />
        </InteractiveDoodle>

        {/* 3. Mid right: Rangefinder compact camera */}
        <InteractiveDoodle
          type="camera"
          className="ds-item ds-about-compact hide-mobile"
          style={{ top: "56%", right: "3%" }}
          floatType="sway"
          floatDuration={8.8}
          floatDelay={0.4}
          label="Compact rangefinder camera doodle"
        >
          <CompactCameraDoodle size={56} />
        </InteractiveDoodle>

        {/* 4. Bottom center: Wavy film strip */}
        <InteractiveDoodle
          type="film"
          className="ds-item ds-about-filmstrip hide-mobile"
          style={{ bottom: "10%", left: "36%" }}
          floatType="drift"
          floatDuration={7.8}
          floatDelay={1.0}
          label="35mm film strip doodle"
        >
          <FilmStripDoodle size={62} />
        </InteractiveDoodle>

        {/* 5. Lower Left: Film Roll Canister */}
        <InteractiveDoodle
          type="film"
          className="ds-item ds-about-roll hide-mobile"
          style={{ bottom: "12%", left: "6%" }}
          floatType="wave"
          floatDuration={7.4}
          floatDelay={0.8}
          label="35mm film canister"
        >
          <FilmRollDoodle size={46} />
        </InteractiveDoodle>

        {/* 6. Lower Right: Heart Frame */}
        <InteractiveDoodle
          type="heart"
          className="ds-item ds-about-heart"
          style={{ bottom: "10%", right: "5%" }}
          floatType="gentle"
          floatDuration={8.0}
          floatDelay={0.3}
          label="Heart camera frame"
        >
          <HeartFrameDoodle size={52} />
        </InteractiveDoodle>

        {/* Sparkles */}
        <InteractiveDoodle
          type="star"
          className="ds-item hide-mobile"
          style={{ top: "18%", left: "6%" }}
          floatType="gentle"
          floatDuration={6.5}
          floatDelay={1.3}
        >
          <StarDoodle size={20} variant="star" />
        </InteractiveDoodle>
        <InteractiveDoodle
          type="star"
          className="ds-item hide-mobile"
          style={{ bottom: "22%", right: "16%" }}
          floatType="drift"
          floatDuration={7.0}
          floatDelay={1.5}
        >
          <StarDoodle size={22} variant="sparkle" />
        </InteractiveDoodle>
      </div>
    );
  }

  // 4. Page Scene (Portfolio & Services): Elegant perimeter floating
  if (variant === "page") {
    return (
      <div className={`doodle-scene doodle-scene-page ${className}`} aria-hidden="false">
        {showPattern && <DoodlePattern opacity={0.045} />}

        {/* 1. Top Center: Vintage camera */}
        <InteractiveDoodle
          type="camera"
          className="ds-item ds-page-vintage hide-mobile"
          style={{ top: "14%", left: "34%" }}
          floatType="gentle"
          floatDuration={7.8}
          floatDelay={0.2}
          label="Vintage camera doodle"
        >
          <VintageCameraDoodle size={52} />
        </InteractiveDoodle>

        {/* 2. Top Right: Focus Lens (below navbar) */}
        <InteractiveDoodle
          type="lens"
          className="ds-item ds-page-lens"
          style={{ top: "18%", right: "5%" }}
          floatType="wave"
          floatDuration={8.4}
          floatDelay={0.5}
          label="Interactive camera lens"
        >
          <LensDoodle size={50} />
        </InteractiveDoodle>

        {/* 3. Bottom Right: Bird */}
        <InteractiveDoodle
          type="bird"
          className="ds-item ds-page-bird"
          style={{ bottom: "12%", right: "6%" }}
          floatType="sway"
          floatDuration={7.2}
          floatDelay={0.4}
          label="Smile for the birdie doodle"
        >
          <BirdDoodle size={46} />
        </InteractiveDoodle>

        {/* 4. Mid-Right Channel: Film strip */}
        <InteractiveDoodle
          type="film"
          className="ds-item ds-page-filmstrip hide-mobile"
          style={{ bottom: "14%", right: "18%" }}
          floatType="drift"
          floatDuration={7.8}
          floatDelay={0.8}
          label="35mm film strip"
        >
          <FilmStripDoodle size={58} />
        </InteractiveDoodle>

        {/* 5. Lower Center: Film roll */}
        <InteractiveDoodle
          type="film"
          className="ds-item ds-page-roll hide-mobile"
          style={{ bottom: "10%", left: "40%" }}
          floatType="drift"
          floatDuration={7.4}
          floatDelay={1.1}
          label="35mm film canister"
        >
          <FilmRollDoodle size={46} />
        </InteractiveDoodle>

        {/* 6. Lower Left: Heart frame */}
        <InteractiveDoodle
          type="heart"
          className="ds-item ds-page-heart"
          style={{ bottom: "12%", left: "5%" }}
          floatType="gentle"
          floatDuration={8.0}
          floatDelay={0.3}
          label="Heart camera frame"
        >
          <HeartFrameDoodle size={50} />
        </InteractiveDoodle>

        {/* Subtle sparkle */}
        <InteractiveDoodle
          type="star"
          className="ds-item hide-mobile"
          style={{ top: "24%", right: "24%" }}
          floatType="gentle"
          floatDuration={6.6}
          floatDelay={1.2}
        >
          <StarDoodle size={20} variant="sparkle" />
        </InteractiveDoodle>
      </div>
    );
  }

  // 5. Default "Hero" Scene (Home Page): Rich & lively ("little more, not over")
  // Curated 10 interactive doodles + 2 sparkles, perfectly scattered across negative spaces.
  return (
    <div className={`doodle-scene doodle-scene-hero ${className}`} aria-hidden="false">
      {showPattern && <DoodlePattern opacity={0.045} />}

      {/* 1. Upper-Center Channel: "CLICK IT!" Invitation Bubble */}
      <InteractiveDoodle
        type="click"
        className="ds-item ds-hero-click"
        style={{ top: "20%", left: "48%" }}
        floatType="drift"
        floatDuration={8.6}
        floatDelay={0.8}
        label="Click it speech bubble — snap snapshot"
      >
        <SpeechBubbleDoodle variant="click" size={56} />
      </InteractiveDoodle>

      {/* 2. Upper Channel Sky: Wavy 35mm Film Strip */}
      <InteractiveDoodle
        type="film"
        className="ds-item ds-hero-filmstrip hide-mobile"
        style={{ top: "14%", left: "34%" }}
        floatType="wave"
        floatDuration={9.4}
        floatDelay={0.3}
        label="35mm film strip"
      >
        <FilmStripDoodle size={64} />
      </InteractiveDoodle>

      {/* 3. Upper Right Sky: Focus Lens (flanking above portrait arch) */}
      <InteractiveDoodle
        type="lens"
        className="ds-item ds-hero-lens hide-mobile"
        style={{ top: "13%", right: "22%" }}
        floatType="wave"
        floatDuration={8.8}
        floatDelay={0.5}
        label="Focus lens doodle — click to lock autofocus"
      >
        <LensDoodle size={52} />
      </InteractiveDoodle>

      {/* 4. Mid-Center Breathing Channel: Vintage TLR Camera */}
      <InteractiveDoodle
        type="camera"
        className="ds-item ds-hero-vintage hide-mobile"
        style={{ top: "42%", left: "40%" }}
        floatType="gentle"
        floatDuration={7.8}
        floatDelay={0}
        label="Vintage TLR camera — click to snap snapshot"
      >
        <VintageCameraDoodle size={58} />
      </InteractiveDoodle>

      {/* 5. Top-Right Sky: Camera with Radiating Flash Rays */}
      <InteractiveDoodle
        type="camera"
        className="ds-item ds-hero-flash"
        style={{ top: "18%", right: "6%" }}
        floatType="drift"
        floatDuration={8.2}
        floatDelay={0.4}
        label="Camera with flash — click to trigger flash"
      >
        <CameraWithFlashDoodle size={58} />
      </InteractiveDoodle>

      {/* 6. Mid-Right Flank: Professional DSLR Camera */}
      <InteractiveDoodle
        type="camera"
        className="ds-item ds-hero-dslr"
        style={{ top: "52%", right: "2.5%" }}
        floatType="sway"
        floatDuration={8.5}
        floatDelay={0.6}
        label="Professional DSLR camera — click to trigger shutter"
      >
        <DSLRCameraDoodle size={62} />
      </InteractiveDoodle>

      {/* 7. Lower Center (Right of CTA buttons): Cheerful Bird Doodle ("Smile for the birdie!") */}
      <InteractiveDoodle
        type="bird"
        className="ds-item ds-hero-bird"
        style={{ bottom: "10%", left: "30%" }}
        floatType="gentle"
        floatDuration={7.0}
        floatDelay={0.7}
        label="Birdie doodle — smile for the camera"
      >
        <BirdDoodle size={50} />
      </InteractiveDoodle>

      {/* 8. Bottom-Center Channel: 35mm Film Roll Canister */}
      <InteractiveDoodle
        type="film"
        className="ds-item ds-hero-roll hide-mobile"
        style={{ bottom: "8%", left: "46%" }}
        floatType="drift"
        floatDuration={7.6}
        floatDelay={1.1}
        label="35mm film roll"
      >
        <FilmRollDoodle size={46} />
      </InteractiveDoodle>

      {/* 9. Lower Right Channel: Compact Rangefinder Camera */}
      <InteractiveDoodle
        type="camera"
        className="ds-item ds-hero-compact hide-mobile"
        style={{ bottom: "15%", right: "18%" }}
        floatType="gentle"
        floatDuration={8.4}
        floatDelay={0.9}
        label="Compact camera doodle"
      >
        <CompactCameraDoodle size={52} />
      </InteractiveDoodle>

      {/* 10. Bottom-Right Corner: Heart Frame Doodle */}
      <InteractiveDoodle
        type="heart"
        className="ds-item ds-hero-heart"
        style={{ bottom: "6%", right: "6%" }}
        floatType="sway"
        floatDuration={8.0}
        floatDelay={0.5}
        label="Love photography camera frame"
      >
        <HeartFrameDoodle size={54} />
      </InteractiveDoodle>

      {/* Subtle Star Accents Scattered in Negative Space */}
      <InteractiveDoodle
        type="star"
        className="ds-item ds-star-1 hide-mobile"
        style={{ top: "12%", left: "4%" }}
        floatType="gentle"
        floatDuration={6.4}
        floatDelay={1.3}
      >
        <StarDoodle size={20} variant="sparkle" />
      </InteractiveDoodle>

      <InteractiveDoodle
        type="star"
        className="ds-item ds-star-2 hide-mobile"
        style={{ bottom: "24%", right: "24%" }}
        floatType="wave"
        floatDuration={7.2}
        floatDelay={1.5}
      >
        <StarDoodle size={20} variant="star" />
      </InteractiveDoodle>
    </div>
  );
}
