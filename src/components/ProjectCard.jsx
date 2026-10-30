import { useRef } from "react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, className = "", variant = "portrait" }) {
  const ref = useRef(null);

  if (!project) return null;
  const isVideo = project.type === "videography";

  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 900) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Link
      ref={ref}
      to={`/portfolio/${project.slug}`}
      className={`project-card ${variant} ${isVideo ? "is-video-card" : ""} ${className}`}
      aria-label={`${isVideo ? "Watch film" : "View project"} ${project.title}`}
      data-cursor="project"
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <div className="thumb" style={{ position: "relative", overflow: "hidden" }}>
        <img src={project.cover} alt={project.title} loading="lazy" />
        {isVideo && (
          <>
            <span className="video-play-badge">
              ▶ {project.duration || "Watch Film"}
            </span>
            <div className="video-center-indicator" aria-hidden="true">
              <span className="video-play-circle">
                <svg viewBox="0 0 24 24"><polygon points="7 4 19 12 7 20 7 4" /></svg>
              </span>
            </div>
          </>
        )}
      </div>
      <div className="meta">
        <div>
          <h3>{project.title}</h3>
          <div className="cat">
            {isVideo ? `Video · ${project.category}` : project.category}
            {project.location ? ` · ${project.location}` : ""}
          </div>
        </div>
        <span className="view-affordance">
          {isVideo ? "Watch Film →" : "View Project →"}
        </span>
      </div>
    </Link>
  );
}
