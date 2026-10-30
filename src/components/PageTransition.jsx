import { motion, useReducedMotion } from "framer-motion";

/**
 * Minimal, silky-smooth page content entrance animation.
 * Uses a pure opacity crossfade over 0.32s with luxury easing.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
