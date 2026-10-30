import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Lightbox from "./Lightbox";
import { getCategoriesForType, normCategory } from "../utils/projectFilters";

function flatten(projects) {
  const tiles = [];
  projects.forEach((p) => {
    const isVideo = p.type === "videography";
    if (isVideo) {
      tiles.push({
        id: `video-${p.id}`,
        src: p.cover,
        title: p.title,
        slug: p.slug,
        type: "videography",
        category: p.category,
        location: p.location || "",
        duration: p.duration || "",
        videoUrl: p.videoUrl || "",
        featured: !!p.featured,
      });
      return;
    }

    // photography project
    const imgs = [p.cover, ...(p.gallery || [])].filter((v, i, a) => v && a.indexOf(v) === i);
    imgs.forEach((src, i) => {
      const loc =
        (p.photoLocations && p.photoLocations[src]) ||
        p.location ||
        "";
      tiles.push({
        id: `${p.id}-${i}-${String(src).slice(-16)}`,
        src,
        title: p.title,
        slug: p.slug,
        type: "photography",
        category: p.category,
        location: loc,
        featured: p.featured && i === 0,
      });
    });
  });
  return tiles;
}

export default function InteractiveGallery({
  projects = [],
  limit,
  heading = true,
  initialType = "all",
  initialFilter = "All",
  showTypeSelector = true,
}) {
  const navigate = useNavigate();
  const [type, setType] = useState(initialType || "all");
  const [filter, setFilter] = useState(initialFilter || "All");
  const [lb, setLb] = useState(null);

  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  useEffect(() => {
    if (initialFilter) setFilter(initialFilter);
  }, [initialFilter]);

  const allTiles = useMemo(() => flatten(projects), [projects]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setFilter("All"); // Reset category filter on type change to prevent incompatible filter states
  };

  const availableCategories = useMemo(() => {
    return getCategoriesForType(type, projects, { onlyExisting: true });
  }, [type, projects]);

  const tiles = useMemo(() => {
    let list = allTiles;
    if (type !== "all") {
      list = list.filter((t) => t.type === type);
    }
    if (filter && filter !== "All") {
      list = list.filter((t) => normCategory(t.category) === normCategory(filter));
    }
    return typeof limit === "number" && (!filter || filter === "All") ? list.slice(0, limit) : list;
  }, [allTiles, type, filter, limit]);

  // Lightbox only includes photography frames
  const photoTiles = useMemo(() => tiles.filter((t) => t.type !== "videography"), [tiles]);
  const lbImages = photoTiles.map((t) => t.src);
  const activePhoto = lb !== null ? photoTiles[lb] : null;

  const handleTileClick = (t) => {
    if (t.type === "videography") {
      navigate(`/portfolio/${t.slug}`);
    } else {
      const photoIndex = photoTiles.findIndex((pt) => pt.id === t.id);
      if (photoIndex >= 0) setLb(photoIndex);
    }
  };

  return (
    <div className="ig">
      {heading ? (
        <div className="section-head">
          <div>
            <p className="kicker" style={{ color: "var(--cyprus)" }}>
              Interactive portfolio
            </p>
            <h2>THE WORKS</h2>
          </div>
          <p>Explore photography frames and cinematic films by Arjun Murali.</p>
        </div>
      ) : null}

      {/* Primary Type Selector Tabs */}
      {showTypeSelector && (
        <div className="portfolio-type-tabs" role="tablist" aria-label="Portfolio primary type">
          <button
            type="button"
            role="tab"
            aria-selected={type === "all"}
            className={`type-tab-btn ${type === "all" ? "active" : ""}`}
            onClick={() => handleTypeChange("all")}
          >
            All Works
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={type === "photography"}
            className={`type-tab-btn ${type === "photography" ? "active" : ""}`}
            onClick={() => handleTypeChange("photography")}
          >
            Photography
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={type === "videography"}
            className={`type-tab-btn ${type === "videography" ? "active" : ""}`}
            onClick={() => handleTypeChange("videography")}
          >
            Videography
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <LayoutGroup id={`gallery-category-filters-${type}`}>
        <div className="filters" role="tablist" aria-label="Portfolio categories">
          {["All", ...availableCategories].map((c) => {
            const isAll = c === "All";
            const label = isAll ? "All" : c.replace(/ Photography$/i, "");
            const isActive = isAll
              ? !filter || filter === "All"
              : (!(!filter || filter === "All") && normCategory(filter) === normCategory(c));

            return (
              <button
                key={c}
                type="button"
                className={`filter-btn ${isActive ? "active" : ""}`}
                onClick={() => setFilter(c)}
                style={{ position: "relative" }}
              >
                {isActive && (
                  <motion.span
                    layoutId={`ig-pill-${type}`}
                    className="ig-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Masonry / Grid */}
      <motion.div className="ig-masonry" layout>
        <AnimatePresence mode="popLayout">
          {tiles.map((t, i) => {
            const isVideo = t.type === "videography";
            return (
              <motion.button
                layout
                key={t.id}
                type="button"
                className={`ig-tile ${isVideo ? "is-video" : ""} ${t.featured ? "is-feature" : ""} ${i % 7 === 3 ? "is-tall" : ""}`}
                data-cursor={isVideo ? "project" : "photo"}
                onClick={() => handleTileClick(t)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.24) }}
                aria-label={isVideo ? `Watch film ${t.title}` : `Open photo ${t.title}`}
              >
                <img src={t.src} alt={`${t.title} — ${t.category}`} loading="lazy" />

                {isVideo && (
                  <>
                    <span className="video-play-badge">
                      ▶ {t.duration || "Watch Film"}
                    </span>
                    <div className="video-center-indicator" aria-hidden="true">
                      <span className="video-play-circle">
                        <svg viewBox="0 0 24 24"><polygon points="7 4 19 12 7 20 7 4" /></svg>
                      </span>
                    </div>
                  </>
                )}

                <span className="ig-cap">
                  <b>{t.title}</b>
                  <em>
                    {isVideo ? `Video · ${t.category}` : t.category.replace(" Photography", "")}
                    {t.location ? ` · ${t.location}` : ""}
                  </em>
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {!tiles.length ? (
        <div className="empty-state">
          {type === "videography"
            ? "No video projects in this category yet."
            : type === "photography"
            ? "No photographs in this category yet."
            : "No projects found matching the selected filters."}
        </div>
      ) : null}

      <AnimatePresence>
        {lb !== null && activePhoto && (
          <Lightbox
            images={lbImages}
            index={lb}
            title={activePhoto.title}
            caption={
              activePhoto.category.replace(" Photography", "") +
              (activePhoto.location ? ` · ${activePhoto.location}` : "")
            }
            href={`/portfolio/${activePhoto.slug}`}
            onClose={() => setLb(null)}
            onPrev={() => setLb((n) => (n - 1 + photoTiles.length) % photoTiles.length)}
            onNext={() => setLb((n) => (n + 1) % photoTiles.length)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
