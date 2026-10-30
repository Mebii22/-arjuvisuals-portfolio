import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowUpRight } from "react-icons/hi2";
import SEO from "../components/SEO";
import Magnetic from "../components/Magnetic";
import InteractiveGallery from "../components/InteractiveGallery";
import ComboCTA from "../components/ComboCTA";
import Reveal from "../components/Reveal";
import DoodleField from "../components/DoodleField";
import { IconQuote } from "../components/Doodles";
import { projectService } from "../services/projectService";
import { useProfile } from "../hooks/useProfile";
import SoftwareSkills from "../components/SoftwareSkills";
import HomePortraitComposition from "../components/HomePortraitComposition";

export default function Home() {
  const { profile } = useProfile();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectService.list().then(setProjects);
  }, []);

  // Dynamically derive category spots from published projects only
  // Hides demo/placeholder categories that are currently in draft
  const spots = useMemo(() => {
    const map = new Map();
    (projects || []).forEach((p) => {
      const pType = p.type || "photography";
      if (pType !== "photography" || !p.category || p.status !== "published") return;
      if (!map.has(p.category) || p.featured) {
        map.set(p.category, {
          cat: p.category,
          label: p.category.replace(/ Photography$/i, ""),
          img: p.cover,
          slug: p.slug,
        });
      }
    });
    return Array.from(map.values());
  }, [projects]);

  const marqueeItems = useMemo(() => {
    if (!spots.length) return ["Wedding", "Portrait", "Travel", "Nature"];
    return spots.map((s) => s.label);
  }, [spots]);

  const ledeCategories = useMemo(() => {
    if (!spots.length) return "Commercial Photography & Cinematic Videography · Thrissur, Kerala";
    return spots.map((s) => s.label).join(" · ");
  }, [spots]);

  return (
    <>
      <SEO
        title="Home"
        description="ArjuVisuals.co — creative visual portfolio by Arjun Murali. Commercial photography and cinematography."
      />

      <section className="hero-b" aria-label="Introduction">
        <DoodleField variant="hero" />
        <p className="hero-b-vert">PORTFOLIO · 2026</p>

        <div className="hero-b-copy">
          <div className="hero-b-top">
            <span className="dot-pair" aria-hidden="true" />
            <Link to="/about" className="name-chip" data-cursor="brand">
              <span className="name-arrow">→</span>
              {profile.name}
            </Link>
          </div>

          <div className="hero-title-wrap">
            <IconQuote className="quote-mark" />
            <p className="pill-accent">Creative Visual</p>
            <h1 className="display">
              <span className="mark">PORTO</span>
              <br />
              FOLIO.
            </h1>
          </div>
          <p className="hero-tag">{profile.tagline}</p>
          <p className="lede">{ledeCategories}</p>
          <div className="hero-actions">
            <Magnetic>
              <Link to="/portfolio" className="btn btn-cyprus">
                All works <HiArrowUpRight />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn btn-outline-dark">
                Let’s create
              </Link>
            </Magnetic>
          </div>
        </div>

        <HomePortraitComposition profile={profile} />

        <span className="hero-b-num">01</span>
      </section>

      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>{item} ·</span>
          ))}
        </div>
      </div>

      <section className="section works-intro">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker" style={{ color: "var(--cyprus)" }}>
                02 — Selected
              </p>
              <h2>
                ALL <span className="mark sm">WORKS</span>
              </h2>
            </div>
            <p>Commercial photography and cinematography. Filter by type or explore the gallery below.</p>
          </div>

          <div className="spot-grid">
            {spots.map((s) => (
              <Link
                key={s.cat}
                to={`/portfolio?cat=${encodeURIComponent(s.cat)}`}
                className="spot-card"
                data-cursor="project"
              >
                <img src={s.img} alt={s.label} />
                <span>
                  <b>{s.label}</b>
                  <em>View set →</em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--sand)", paddingTop: 0 }}>
        <div className="container">
          <InteractiveGallery projects={projects} heading={false} />
        </div>
      </section>

      <section className="section about-b">
        <div className="container about-b-grid">
          <Reveal>
            <div className="about-b-photo">
              <div className="photo-slab" aria-hidden="true" />
              <img
                src={profile.homeAboutPortrait || profile.portraitAlt || IMG.arjunAlt || "/images/profile/arjun-portrait-alt.jpg"}
                alt={profile.name}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="kicker" style={{ color: "var(--cyprus)" }}>
              03 — About
            </p>
            <h2 className="editorial">Behind the lens, beyond the ordinary.</h2>
            <p className="bio" style={{ margin: "1rem 0 1.2rem" }}>
              {profile.shortBio}
            </p>
            <SoftwareSkills variant="compact" title />
            <Magnetic>
              <Link to="/about" className="btn btn-cyprus" style={{ marginTop: "0.4rem" }}>
                The full story <HiArrowUpRight />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <ComboCTA sandNote={profile.headline} />
    </>
  );
}
