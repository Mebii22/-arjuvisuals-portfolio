import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO";
import ServiceCard from "../components/ServiceCard";
import ComboCTA from "../components/ComboCTA";
import DoodleField from "../components/DoodleField";
import { serviceService } from "../services/serviceService";

export default function Services() {
  const [services, setServices] = useState([]);
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService
      .list()
      .then((data) => setServices(data || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = useMemo(() => {
    if (type === "all") return services;
    return services.filter((s) => s.category === type);
  }, [services, type]);

  return (
    <>
      <SEO
        title="Services"
        description="Commercial photography, portraits, cinematography, events, product and lifestyle, and visual editing from ArjuVisuals.co in Thrissur, Kerala."
      />
      <section className="page-b">
        <DoodleField variant="page" />
        <div className="container">
          <p className="kicker" style={{ color: "var(--cyprus)" }}>
            04 — Offerings
          </p>
          <h1 className="display">
            SER<span className="mark">VICES</span>
          </h1>
          <p className="intro">
            Disciplines across photography and cinematography, offered with care.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          {/* Primary Type Selector Tabs */}
          <div className="portfolio-type-tabs" role="tablist" aria-label="Services medium">
            <button
              type="button"
              role="tab"
              aria-selected={type === "all"}
              className={`type-tab-btn ${type === "all" ? "active" : ""}`}
              onClick={() => setType("all")}
            >
              All Offerings
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={type === "photography"}
              className={`type-tab-btn ${type === "photography" ? "active" : ""}`}
              onClick={() => setType("photography")}
            >
              Photography
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={type === "videography"}
              className={`type-tab-btn ${type === "videography" ? "active" : ""}`}
              onClick={() => setType("videography")}
            >
              Videography
            </button>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 320 }} />
          ) : (
            <div className="service-list">
              {filteredServices.map((s, i) => (
                <ServiceCard key={s.id || s._id} service={s} index={i} />
              ))}
            </div>
          )}

          {filteredServices.length === 0 && !loading && (
            <div className="empty-state" style={{ padding: "3rem 1rem", textAlign: "center" }}>
              No services found for this category.
            </div>
          )}
        </div>
        <div className="container" style={{ marginTop: "3rem" }}>
          <p className="form-note">
            Starting prices are listed only when confirmed. If a figure isn’t shown, write in — the conversation
            is the brief.
          </p>
        </div>
      </section>
      <ComboCTA top="HAVE A STORY" bottom="WORTH TELLING" orb="Write" />
    </>
  );
}
