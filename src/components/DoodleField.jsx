import React from "react";
import DoodleScene from "./doodles/DoodleScene";

export default function DoodleField({ variant = "hero", showPattern = true, className = "" }) {
  return (
    <div className={`doodle-field-container is-${variant} ${className}`}>
      <DoodleScene variant={variant} showPattern={showPattern} />
    </div>
  );
}
