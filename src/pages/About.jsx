import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";
import ComboCTA from "../components/ComboCTA";
import InteractiveGallery from "../components/InteractiveGallery";
import DoodleField from "../components/DoodleField";
import { useProfile } from "../hooks/useProfile";
import { projectService } from "../services/projectService";
import SoftwareSkills from "../components/SoftwareSkills";
import AboutEditorialCollage from "../components/AboutEditorialCollage";
import { formatWhatsAppUrl } from "../data/photographer";

const SPECS = [
  { n: "01", t: "Wedding", p: "Vows, glances, and the quiet in-between." },
  { n: "02", t: "Portrait", p: "Faces, light, and unforced character." },
  { n: "03", t: "Fashion", p: "Silhouette, textile, and editorial mood." },
  { n: "04", t: "Event", p: "Energy of a room without the clutter." },
  { n: "05", t: "Travel", p: "Place, weather, and the figure in it." },
  { n: "06", t: "Nature", p: "Mist, canopy, water, monsoon green." },
  { n: "07", t: "Product", p: "Objects with material honesty." },
];

export default function About() {
  const { profile } = useProfile();
  const [projects, setProjects] = useState([]);
  const wa = formatWhatsAppUrl(profile.whatsapp);

  useEffect(() => {
    projectService.list().then(setProjects);
  }, []);

  const paras = (profile.biography || "").split("\n").filter(Boolean);

  return (
    <>
      <SEO
        title="About Arjun Murali"
        description="Arjun Murali is a freelance photographer and visual editor based in Thrissur, Kerala — currently studying Visual Media Production at Lenor Academy, Malappuram."
      />

      <section className="page-b about-editorial-page">
        <DoodleField variant="about" />
        <div className="container about-editorial-grid">
          {/* Left: Editorial Photography Collage */}
          <div className="about-collage-col">
            <AboutEditorialCollage profile={profile} />
          </div>

          {/* Right: Editorial Biography Section */}
          <div className="about-bio-col">
            <Reveal>
              <p className="kicker" style={{ color: "var(--cyprus)" }}>
                03 — About Arjun Murali
              </p>
              <h1 className="editorial-heading">
                Behind the Lens, <br />
                <span className="editorial-heading-accent">Beyond the Ordinary.</span>
              </h1>
            </Reveal>

            <div className="about-bio-paragraphs">
              {paras.map((para, i) => (
                <Reveal key={i} delay={0.08 * (i + 1)}>
                  <p className="bio-editorial-para">{para}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="about-education-badge">
                <div className="edu-badge-icon" aria-hidden="true">
                  <span className="dot-pulse" />
                </div>
                <div>
                  <span className="edu-status-label">Currently Studying</span>
                  <p className="edu-program-name">Visual Media Production</p>
                  <p className="edu-institution">Lenor Academy, Malappuram</p>
                </div>
              </div>

              <div className="about-meta-row">
                <span className="about-meta-chip">Thrissur, Kerala</span>
                <span className="about-meta-chip">Commercial Photography</span>
                <span className="about-meta-chip">Cinematography</span>
                <span className="about-meta-chip">Visual Editing</span>
              </div>

              <div className="about-contact-row" style={{ marginTop: "1.2rem", display: "flex", flexWrap: "wrap", gap: "0.5rem 1.2rem", fontSize: "0.85rem" }}>
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} style={{ color: "var(--cyprus)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ color: "var(--muted-dark)", textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.06em" }}>Phone</span> {profile.phone}
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} style={{ color: "var(--cyprus)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ color: "var(--muted-dark)", textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.06em" }}>Email</span> {profile.email}
                  </a>
                )}
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyprus)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ color: "var(--muted-dark)", textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.06em" }}>WhatsApp</span> +91 {profile.phone || "7736591311"}
                  </a>
                )}
                {profile.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyprus)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ color: "var(--muted-dark)", textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.06em" }}>Instagram</span> {profile.instagramHandle || "@Arjuvisuals.co"}
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="kicker" style={{ color: "var(--cyprus)" }}>
            How I work
          </p>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", margin: "0.4rem 0 1.6rem" }}>
            SEVEN <span className="mark sm">SETS</span>
          </h2>
          <div className="spec-b">
            {SPECS.map((s, i) => (
              <motion.article
                key={s.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span>{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--white)", paddingTop: "1rem" }}>
        <div className="container">
          <SoftwareSkills variant="grid" title />
        </div>
      </section>

      <section className="section edu-b">
        <div className="container edu-card">
          <div>
            <p className="kicker" style={{ color: "var(--cyprus)" }}>
              Education
            </p>
            <h3>Visual Media Production</h3>
            <p>
              Currently studying at Lenor Academy, Malappuram — ongoing study, not a completed qualification.
            </p>
          </div>
          <div>
            <p className="kicker" style={{ color: "var(--cyprus)" }}>
              Place &amp; Inquiries
            </p>
            <h3>{profile.location}</h3>
            <p>
              Freelance photography and visual editing. Direct inquiries welcome via{" "}
              {profile.phone && (
                <a href={`tel:${profile.phone}`} style={{ textDecoration: "underline", color: "inherit" }}>
                  phone ({profile.phone})
                </a>
              )}
              {profile.phone && wa && ", "}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "inherit" }}>
                  WhatsApp
                </a>
              )}
              {profile.email && (
                <>
                  {", or email at "}
                  <a href={`mailto:${profile.email}`} style={{ textDecoration: "underline", color: "inherit" }}>
                    {profile.email}
                  </a>
                </>
              )}.
            </p>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section" style={{ background: "var(--sand)" }}>
          <div className="container">
            <InteractiveGallery projects={projects} heading />
          </div>
        </section>
      )}

      <ComboCTA kicker="Next frame" top="LET'S MAKE" bottom="IT STAY" orb="Begin" />
    </>
  );
}
