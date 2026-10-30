import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import InteractiveGallery from "../components/InteractiveGallery";
import DoodleField from "../components/DoodleField";
import { projectService } from "../services/projectService";

export default function Portfolio() {
  const [params] = useSearchParams();
  const startType = params.get("type") || "all";
  const startCat = params.get("cat") || "All";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    projectService
      .list()
      .then((list) => on && setProjects(list))
      .catch(() => on && setError("Could not load the gallery."))
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Works"
        description="Explore commercial photography and cinematography projects by Arjun Murali — ArjuVisuals.co, Thrissur, Kerala."
      />
      <section className="page-b">
        <DoodleField variant="page" />
        <div className="container">
          <p className="kicker" style={{ color: "var(--cyprus)" }}>
            02 — Portfolio
          </p>
          <h1 className="display">
            ALL <span className="mark">WORKS</span>
          </h1>
          <p className="intro">
            Explore commercial photography and cinematography. Filter by type or discipline.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <p className="form-note" style={{ marginBottom: "1.6rem" }}>
            Visual works by Arjun Murali. Original frames and cinematic reels.
          </p>
          {loading && <div className="skeleton" style={{ height: 360 }} />}
          {error && <div className="empty-state">{error}</div>}
          {!loading && !error && (
            <InteractiveGallery
              projects={projects}
              heading={false}
              initialType={startType}
              initialFilter={startCat}
              showTypeSelector={true}
            />
          )}
        </div>
      </section>
    </>
  );
}
