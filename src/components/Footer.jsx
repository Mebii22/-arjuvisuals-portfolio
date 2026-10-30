import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { formatWhatsAppUrl } from "../data/photographer";
import Magnetic from "./Magnetic";

export default function Footer() {
  const { profile } = useProfile();
  const year = new Date().getFullYear();
  const wa = formatWhatsAppUrl(profile.whatsapp);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="wordmark" data-cursor="brand">
              ARJU VISUALS<span className="co">.CO</span>
            </div>
            <p>
              {profile.tagline} Photography from {profile.city || "Thrissur"}, Kerala — visuals with purpose, stories that stay.
            </p>
          </div>
          <div className="footer-col">
            <h4>Studio</h4>
            <Link to="/portfolio">All works</Link>
            <Link to="/about">About Arjun</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Start a project</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>{profile.location}</p>
            {profile.phone ? (
              <a href={`tel:${profile.phone}`}>{profile.phone}</a>
            ) : null}
            {profile.email ? (
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            ) : (
              <p>Email — to be published</p>
            )}
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            ) : null}
            {profile.instagram ? (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            ) : (
              <p>Instagram — coming soon</p>
            )}
            <Magnetic>
              <Link to="/contact" className="btn btn-sand" style={{ marginTop: "1rem" }}>
                Let’s Create
              </Link>
            </Magnetic>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} ArjuVisuals.co · {profile.name || "Arjun Murali"}</span>
          <span>{profile.location || "Thrissur, Kerala, India"}</span>
        </div>
      </div>
    </footer>
  );
}
