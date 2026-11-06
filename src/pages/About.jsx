import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiArrowUpRight, HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";
import ComboCTA from "../components/ComboCTA";
import InteractiveGallery from "../components/InteractiveGallery";
import DoodleField from "../components/DoodleField";
import { useProfile } from "../hooks/useProfile";
import { projectService } from "../services/projectService";
import { serviceService } from "../services/serviceService";
import SoftwareSkills from "../components/SoftwareSkills";
import AboutEditorialCollage from "../components/AboutEditorialCollage";

const NUMBER_WORDS = [
  "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT",
  "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN",
  "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN", "TWENTY"
];

export default function About() {
  const { profile } = useProfile();
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    projectService.list().then((list) => setProjects(list || [])).catch(() => setProjects([]));
    serviceService.list().then((list) => setServices(list || [])).catch(() => setServices([]));
  }, []);

  const cleanPhoneTel = useMemo(() => {
    if (!profile.phone) return "";
    return `tel:${String(profile.phone).trim().replace(/[^\d+]/g, "")}`;
  }, [profile.phone]);

  const cleanWhatsAppDigits = useMemo(() => {
    const raw = String(profile.whatsapp || profile.phone || "").replace(/\D/g, "");
    if (!raw) return "";
    return raw.length === 10 ? `91${raw}` : raw;
  }, [profile.whatsapp, profile.phone]);

  const whatsappUrl = useMemo(() => {
    if (!cleanWhatsAppDigits) return "";
    return `https://wa.me/${cleanWhatsAppDigits}`;
  }, [cleanWhatsAppDigits]);

  const whatsappDisplay = useMemo(() => {
    return profile.whatsapp || profile.phone || "Chat on WhatsApp";
  }, [profile.whatsapp, profile.phone]);

  const instagramUrl = useMemo(() => {
    if (!profile.instagram) {
      if (profile.instagramHandle) {
        return `https://instagram.com/${profile.instagramHandle.replace(/^@/, "").trim()}`;
      }
      return "";
    }
    const clean = profile.instagram.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
    return `https://instagram.com/${clean.replace(/^@/, "").replace(/\/$/, "")}`;
  }, [profile.instagram, profile.instagramHandle]);

  const instagramDisplay = useMemo(() => {
    if (profile.instagramHandle) return profile.instagramHandle;
    if (profile.instagram) {
      const handle = profile.instagram.trim().replace(/\/$/, "").split("/").pop();
      return handle ? (handle.startsWith("@") ? handle : `@${handle}`) : "@Arjuvisuals.co";
    }
    return "@Arjuvisuals.co";
  }, [profile.instagramHandle, profile.instagram]);

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

              <div className="about-contact-section" style={{ marginTop: "1.6rem" }}>
                <p className="kicker" style={{ color: "var(--cyprus)", marginBottom: "0.75rem", fontSize: "0.72rem" }}>
                  Connect with Arjun — Direct Contact
                </p>
                <div className="direct-contact-list">
                  {/* Email */}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email.trim()}`}
                      className="direct-contact-item"
                      title={`Email ${profile.name || "Arjun Murali"}`}
                    >
                      <div className="direct-contact-icon email" aria-hidden="true">
                        <HiOutlineEnvelope size={20} />
                      </div>
                      <div className="direct-contact-details">
                        <span className="direct-contact-label">Email</span>
                        <span className="direct-contact-value">{profile.email}</span>
                      </div>
                      <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                    </a>
                  )}

                  {/* Phone */}
                  {profile.phone && (
                    <a
                      href={cleanPhoneTel}
                      className="direct-contact-item"
                      title={`Call ${profile.name || "Arjun Murali"}`}
                    >
                      <div className="direct-contact-icon phone" aria-hidden="true">
                        <HiOutlinePhone size={20} />
                      </div>
                      <div className="direct-contact-details">
                        <span className="direct-contact-label">Phone</span>
                        <span className="direct-contact-value">{profile.phone}</span>
                      </div>
                      <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                    </a>
                  )}

                  {/* WhatsApp */}
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="direct-contact-item"
                      title="Chat on WhatsApp"
                    >
                      <div className="direct-contact-icon whatsapp" aria-hidden="true">
                        <FaWhatsapp size={20} />
                      </div>
                      <div className="direct-contact-details">
                        <span className="direct-contact-label">WhatsApp</span>
                        <span className="direct-contact-value">{whatsappDisplay}</span>
                      </div>
                      <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                    </a>
                  )}

                  {/* Instagram */}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="direct-contact-item"
                      title="View Instagram Profile"
                    >
                      <div className="direct-contact-icon instagram" aria-hidden="true">
                        <FaInstagram size={20} />
                      </div>
                      <div className="direct-contact-details">
                        <span className="direct-contact-label">Instagram</span>
                        <span className="direct-contact-value">{instagramDisplay}</span>
                      </div>
                      <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <p className="kicker" style={{ color: "var(--cyprus)" }}>
              How I work
            </p>
            <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", margin: "0.4rem 0 1.6rem" }}>
              {NUMBER_WORDS[services.length] || String(services.length)} <span className="mark sm">SETS</span>
            </h2>
            <div className="spec-b">
              {services.map((s, i) => (
                <motion.article
                  key={s.id || s._id || s.slug || s.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

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
            <h3>{profile.location || "Thrissur, Kerala"}</h3>
            <p>
              Freelance photography and visual editing. Direct inquiries welcome via{" "}
              {profile.phone && (
                <a href={cleanPhoneTel || `tel:${profile.phone}`} style={{ textDecoration: "underline", color: "inherit" }}>
                  phone ({profile.phone})
                </a>
              )}
              {profile.phone && whatsappUrl && ", "}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "inherit" }}>
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
