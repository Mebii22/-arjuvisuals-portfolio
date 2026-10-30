import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Lightbox({
  images,
  index,
  title,
  caption,
  href,
  onClose,
  onPrev,
  onNext,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!images?.[index]) return null;
  const src = images[index];

  return createPortal(
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className="lb-close" onClick={onClose} type="button">
        Close ✕
      </button>
      <button
        className="lb-prev"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photograph"
      >
        ←
      </button>
      <motion.img
        key={src}
        src={src}
        alt={`${title || "Photograph"} ${index + 1} of ${images.length}`}
        initial={{ opacity: 0.4, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="lb-next"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next photograph"
      >
        →
      </button>
      <div className="lb-count">
        <span>
          {title}
          {caption ? ` · ${caption}` : ""} — {index + 1} / {images.length}
        </span>
        {href ? (
          <Link to={href} onClick={(e) => e.stopPropagation()} className="lb-series">
            Open series →
          </Link>
        ) : null}
      </div>
    </motion.div>,
    document.body
  );
}
