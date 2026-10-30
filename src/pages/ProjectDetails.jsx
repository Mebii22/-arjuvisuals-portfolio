import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SEO from "../components/SEO";
import Lightbox from "../components/Lightbox";
import SplitTitle from "../components/SplitTitle";
import ComboCTA from "../components/ComboCTA";
import { projectService } from "../services/projectService";
import { getVideoEmbedInfo } from "../utils/projectFilters";
import { resolveVideoUrl } from "../utils/videoStorage";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetails() {
  const { slug } = useParams();
  const { isAuthed } = useAuth();
  const [project, setProject] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [siblings, setSiblings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lb, setLb] = useState(null);
  const [playableVideoUrl, setPlayableVideoUrl] = useState("");

  useEffect(() => {
    let on = true;
    setLoading(true);
    Promise.all([
      projectService.getBySlugAny(slug),
      projectService.list(), // Only published projects
    ]).then(async ([p, list]) => {
      if (!on) return;
      if (!p) {
        setProject(null);
        setIsDraft(false);
        setNotFound(true);
      } else if (p.status !== "published") {
        if (isAuthed) {
          // Allow authenticated admin to preview draft
          setProject(p);
          setIsDraft(true);
          setNotFound(false);
        } else {
          // Public visitor accessing draft project
          setProject(null);
          setIsDraft(true);
          setNotFound(false);
        }
      } else {
        setProject(p);
        setIsDraft(false);
        setNotFound(false);
      }

      setSiblings(list || []);
      if (p && p.type === "videography" && p.videoUrl) {
        const resolved = await resolveVideoUrl(p.videoUrl);
        if (on) setPlayableVideoUrl(resolved);
      }
      setLoading(false);
    });
    return () => {
      on = false;
    };
  }, [slug, isAuthed]);

  if (loading) {
    return (
      <div className="detail-hero">
        <div className="skeleton" style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }

  // Proper project-not-available page when accessing an unpublished draft URL
  if (!project && isDraft) {
    return (
      <section className="section" style={{ minHeight: "65vh", display: "grid", placeItems: "center" }}>
        <div className="container empty-state" style={{ maxWidth: 640, textAlign: "center", padding: "3rem 1.5rem" }}>
          <p className="kicker" style={{ color: "var(--cyprus)" }}>Project Unavailable</p>
          <h1 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", margin: "0.6rem 0 1rem" }}>
            NOT AVAILABLE
          </h1>
          <p style={{ color: "var(--muted-dark)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.8rem" }}>
            This project is currently in draft or has not been published yet. Original photographs and films will be published here once ready.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/portfolio" className="btn btn-cyprus">
              Browse published works
            </Link>
            <Link to="/" className="btn btn-outline-dark">
              Return home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Proper 404 page when project does not exist
  if (!project) {
    return (
      <section className="section" style={{ minHeight: "65vh", display: "grid", placeItems: "center" }}>
        <div className="container empty-state" style={{ maxWidth: 640, textAlign: "center", padding: "3rem 1.5rem" }}>
          <p className="kicker" style={{ color: "var(--cyprus)" }}>404 Not Found</p>
          <h1 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", margin: "0.6rem 0 1rem" }}>
            PROJECT NOT FOUND
          </h1>
          <p style={{ color: "var(--muted-dark)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.8rem" }}>
            The project you are looking for does not exist or the link is out of date.
          </p>
          <Link to="/portfolio" className="btn btn-cyprus">
            Back to portfolio
          </Link>
        </div>
      </section>
    );
  }

  const isVideo = project.type === "videography";
  const embedInfo = isVideo
    ? getVideoEmbedInfo(playableVideoUrl || project.videoUrl, project.videoProvider)
    : null;

  // Stills / gallery images
  const images = isVideo
    ? (project.gallery || []).filter((v, i, a) => v && a.indexOf(v) === i)
    : [project.cover, ...(project.gallery || [])].filter((v, i, a) => v && a.indexOf(v) === i);

  const idx = siblings.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const open = (i) => setLb(i);
  const close = () => setLb(null);
  const step = (dir) =>
    setLb((i) => {
      const n = images.length;
      return (i + dir + n) % n;
    });

  return (
    <>
      <SEO title={project.title} description={project.short} />
      {isDraft && (
        <aside
          role="status"
          aria-label="Admin Draft Preview Notice"
          style={{
            background: "#660810",
            color: "var(--stone)",
            padding: "0.75rem 1.4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
            fontSize: "0.82rem",
            position: "sticky",
            top: 0,
            zIndex: 120,
            boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
            borderBottom: "1px solid rgba(240, 237, 229, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(0, 0, 0, 0.45)",
                color: "#ffd166",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                padding: "0.2rem 0.55rem",
                borderRadius: "3px",
                border: "1px solid rgba(255, 209, 102, 0.4)",
              }}
            >
              DRAFT PREVIEW
            </span>
            <span>
              This project is unpublished. It is only visible to you because you are logged in as admin.
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Link
              to={`/admin/projects/${project.id}/edit`}
              className="btn btn-sand"
              style={{ padding: "0.35rem 0.8rem", fontSize: "0.72rem" }}
            >
              Edit Project
            </Link>
            <Link
              to="/admin/projects"
              style={{
                color: "var(--stone)",
                fontSize: "0.74rem",
                textDecoration: "underline",
                marginLeft: "0.4rem",
              }}
            >
              Back to Admin
            </Link>
          </div>
        </aside>
      )}
      <section className="detail-hero">
        <motion.img
          src={project.cover}
          alt={project.title}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="shade" />
        <div className="copy">
          <p className="kicker">
            {isVideo ? `Videography · ${project.category}` : project.category}
          </p>
          <h1>
            <SplitTitle text={project.title.toUpperCase()} />
          </h1>
          <div className="detail-meta">
            {isVideo && project.duration && (
              <span>Duration: {project.duration}</span>
            )}
            {project.location && <span>{project.location}</span>}
            {project.shootDate && (
              <span>
                {new Date(project.shootDate).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {project.placeholder && <span>Representative visuals</span>}
          </div>
          {isVideo && (
            <div style={{ marginTop: "1.4rem" }}>
              <a
                href="#film-player"
                className="btn btn-sand"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  padding: "0.65rem 1.35rem",
                }}
              >
                <span>▶</span> Watch Film
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Embedded Video Player Section for Videography */}
      {isVideo && embedInfo && embedInfo.type !== "none" && (
        <section id="film-player" className="detail-video-section">
          <div className="container video-player-container">
            <div className="video-responsive-box">
              {embedInfo.type === "youtube" || embedInfo.type === "vimeo" ? (
                <iframe
                  src={embedInfo.embedUrl}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : embedInfo.type === "video" ? (
                <video
                  controls
                  playsInline
                  poster={project.cover}
                  src={embedInfo.url}
                  style={{ width: "100%", height: "100%", background: "#000" }}
                >
                  <source src={embedInfo.url} type={embedInfo.url.endsWith(".webm") ? "video/webm" : "video/mp4"} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "2rem", textAlign: "center" }}>
                  <p>Stream source available externally</p>
                  <a
                    href={embedInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sand"
                    style={{ marginTop: "1rem" }}
                  >
                    Open video stream →
                  </a>
                </div>
              )}
            </div>

            <div className="video-meta-bar">
              <div className="video-meta-chips">
                {project.duration && (
                  <span className="video-chip accent">▶ {project.duration}</span>
                )}
                <span className="video-chip">
                  Platform: {embedInfo.type === "youtube" ? "YouTube" : embedInfo.type === "vimeo" ? "Vimeo" : embedInfo.provider === "device" ? "Device Upload" : "Direct Stream"}
                </span>
                <span className="video-chip">
                  {project.category}
                </span>
              </div>
              {embedInfo.watchUrl && embedInfo.type !== "video" && (
                <a
                  href={embedInfo.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-ext-link"
                >
                  Open on {embedInfo.type === "youtube" ? "YouTube" : "Vimeo"} ↗
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="container detail-body">
        <div>
          <p className="kicker" style={{ color: "var(--cyprus)" }}>
            {isVideo ? "About the film" : "The series"}
          </p>
          <p
            className="editorial"
            style={{ fontSize: "2rem", marginTop: "0.6rem", fontStyle: "italic" }}
          >
            {project.short}
          </p>
        </div>
        <div>
          <p style={{ fontWeight: 300, fontSize: "1.05rem", whiteSpace: "pre-line" }}>
            {project.description}
          </p>
        </div>
      </section>

      {/* Production Stills / Photography Stack */}
      {images.length > 0 && (
        <section className="container">
          {isVideo && (
            <div className="section-subhead-bts">
              <p className="kicker" style={{ color: "var(--cyprus)" }}>Production</p>
              <h3>STILLS & BEHIND THE SCENES</h3>
              <p>Location frames and production captures from this project</p>
            </div>
          )}
          <div className="gallery-stack">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => open(i)}
                data-cursor="photo"
                style={{
                  padding: 0,
                  border: 0,
                  background: "none",
                  display: "block",
                  width: i % 3 === 0 ? "100%" : undefined,
                }}
              >
                <motion.img
                  src={src}
                  alt={`${project.title} — frame ${i + 1}`}
                  loading="lazy"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ aspectRatio: i % 3 === 0 ? "16 / 9" : "4 / 5", objectFit: "cover", width: "100%" }}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="container pager">
        {prev ? (
          <Link to={`/portfolio/${prev.slug}`} className="btn-ghost">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/portfolio" className="btn-ghost">
          All work
        </Link>
        {next ? (
          <Link to={`/portfolio/${next.slug}`} className="btn-ghost">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      <ComboCTA
        kicker={isVideo ? `Videography · ${project.category}` : project.category}
        top="LIKE THIS"
        bottom={isVideo ? "FILM?" : "SERIES?"}
        orb="Book"
      />

      <AnimatePresence>
        {lb !== null && images[lb] && (
          <Lightbox
            images={images}
            index={lb}
            title={project.title}
            caption={
              (isVideo ? `Behind the scenes · ${project.category}` : project.category.replace(" Photography", "")) +
              ((project.photoLocations && project.photoLocations[images[lb]]) || project.location
                ? ` · ${(project.photoLocations && project.photoLocations[images[lb]]) || project.location}`
                : "")
            }
            onClose={close}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
