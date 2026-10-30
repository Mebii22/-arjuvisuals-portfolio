import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.038, delayChildren: 0.05 },
  },
};

const child = {
  hidden: { y: "108%" },
  show: {
    y: "0%",
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SplitTitle({ text = "", className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  // Split into words so characters within a word stay together and wrap cleanly
  const words = String(text || "").split(" ");

  return (
    <motion.span
      className={`split-title ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
      transition={{ delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <span
          key={`w-${wordIdx}`}
          className="split-word"
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((ch, i) => (
            <span key={`${ch}-${wordIdx}-${i}`} className="split-char" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
              <motion.span variants={child} style={{ display: "inline-block" }}>
                {ch}
              </motion.span>
            </span>
          ))}
          {wordIdx < words.length - 1 && (
            <span className="split-char split-space" aria-hidden="true" style={{ display: "inline-block" }}>
              {"\u00A0"}
            </span>
          )}
        </span>
      ))}
    </motion.span>
  );
}
