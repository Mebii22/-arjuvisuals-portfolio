import React from "react";
import VintageCameraDoodle from "./VintageCameraDoodle";
import DSLRCameraDoodle from "./DSLRCameraDoodle";
import TelephotoCameraDoodle from "./TelephotoCameraDoodle";
import CompactCameraDoodle from "./CompactCameraDoodle";
import CameraWithFlashDoodle from "./CameraWithFlashDoodle";
import HeartFrameDoodle from "./HeartFrameDoodle";

export default function CameraDoodle({
  variant = "dslr", // "vintage" | "dslr" | "telephoto" | "horizontal" | "compact" | "flash" | "heart"
  ...props
}) {
  switch (variant) {
    case "vintage":
      return <VintageCameraDoodle {...props} />;
    case "telephoto":
      return <TelephotoCameraDoodle variant="angled" {...props} />;
    case "horizontal":
      return <TelephotoCameraDoodle variant="horizontal" {...props} />;
    case "compact":
      return <CompactCameraDoodle {...props} />;
    case "flash":
      return <CameraWithFlashDoodle {...props} />;
    case "heart":
      return <HeartFrameDoodle {...props} />;
    case "dslr":
    default:
      return <DSLRCameraDoodle {...props} />;
  }
}
