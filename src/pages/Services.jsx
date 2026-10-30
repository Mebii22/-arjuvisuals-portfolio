import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import ServiceCard from "../components/ServiceCard";
import ComboCTA from "../components/ComboCTA";
import DoodleField from "../components/DoodleField";
import { serviceService } from "../services/serviceService";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    serviceService.list().then(setServices);
  }, []);

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
          <p className="intro">Seven photography disciplines, offered with care.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container service-list">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
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
