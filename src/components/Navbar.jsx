import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import Magnetic from "./Magnetic";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Works" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  const darkHero = pathname.startsWith("/portfolio/") && pathname !== "/portfolio";

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const cls = [
    "site-nav",
    darkHero && !solid ? "is-dark" : "is-light",
    solid && darkHero ? "is-solid" : "",
    solid && !darkHero ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={cls}>
        <div className="nav-inner">
          <Link to="/" className="wordmark" data-cursor="brand" aria-label="ArjuVisuals.co home">
            ARJU VISUALS<span className="co">.CO</span>
          </Link>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Magnetic strength={0.3}>
            <Link to="/contact" className="nav-cta">
              Let’s Create <HiArrowUpRight />
            </Link>
          </Magnetic>
          <button
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <header>
              <Link to="/" className="wordmark">
                ARJU VISUALS<span className="co">.CO</span>
              </Link>
              <button className="nav-toggle" onClick={() => setOpen(false)} aria-label="Close menu">
                <span style={{ transform: "translateY(8px) rotate(45deg)" }} />
                <span style={{ opacity: 0 }} />
                <span style={{ transform: "translateY(-8px) rotate(-45deg)" }} />
              </button>
            </header>
            <nav>
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 * i }}
                >
                  <NavLink to={l.to} end={l.to === "/"}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                <Link to="/contact" className="btn btn-sand" style={{ marginTop: "1.5rem", width: "fit-content" }}>
                  Let’s Create
                </Link>
              </motion.div>
            </nav>
            <p className="kicker">Thrissur, Kerala · Turning moments into timeless visuals.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
