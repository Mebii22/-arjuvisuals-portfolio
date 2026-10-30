import { useEffect } from "react";

export default function SEO({
  title,
  description = "ArjuVisuals.co — photography, cinematography, and visual editing by Arjun Murali in Thrissur, Kerala. Turning moments into timeless visuals.",
}) {
  useEffect(() => {
    const full = title
      ? `${title} — ArjuVisuals.co`
      : "ArjuVisuals.co — Turning moments into timeless visuals.";
    document.title = full;

    const ensure = (key, attr, value) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    ensure("description", "name", description);
    ensure("og:title", "property", full);
    ensure("og:description", "property", description);
  }, [title, description]);

  return null;
}
