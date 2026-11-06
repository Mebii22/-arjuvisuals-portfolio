import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineEnvelope, HiOutlinePhone, HiArrowUpRight } from "react-icons/hi2";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import SEO from "../../components/SEO";
import { projectService } from "../../services/projectService";
import { inquiryService } from "../../services/inquiryService";
import { useProfile } from "../../hooks/useProfile";

export default function AdminDashboard() {
  const { profile } = useProfile();
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const loadStats = () => {
    projectService.list({ includeDrafts: true }).then(setProjects).catch(() => setProjects([]));
    inquiryService.list().then((list) => setInquiries(Array.isArray(list) ? list : [])).catch(() => setInquiries([]));
  };

  useEffect(() => {
    loadStats();
    window.addEventListener("focus", loadStats);
    window.addEventListener("inquiriesUpdated", loadStats);
    return () => {
      window.removeEventListener("focus", loadStats);
      window.removeEventListener("inquiriesUpdated", loadStats);
    };
  }, []);

  const total = projects.length;
  const photography = projects.filter((p) => (p.type || "photography") === "photography").length;
  const videography = projects.filter((p) => p.type === "videography").length;
  const published = projects.filter((p) => p.status === "published").length;
  const drafts = projects.filter((p) => p.status === "draft").length;
  const unreadInquiries = inquiries.filter((i) => !i.isRead).length;

  const cleanPhone = String(profile.whatsapp || profile.phone || "").replace(/\D/g, "");
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : "";
  const instagramUrl = profile.instagram?.startsWith("http")
    ? profile.instagram
    : `https://instagram.com/${(profile.instagram || "").replace(/^@/, "").trim()}`;

  return (
    <>
      <SEO title="Studio overview" />
      <div className="admin-top">
        <h1>OVERVIEW</h1>
        <Link to="/admin/projects/new" className="btn btn-sand">
          New project
        </Link>
      </div>
      <div className="demo-banner">
        <strong>Arjun Murali — sole administrator.</strong> Live portfolio metrics for commercial photography &amp; videography.
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
        {[
          [total, "Total projects", "/admin/projects"],
          [photography, "Photography", "/admin/projects"],
          [videography, "Videography", "/admin/projects"],
          [published, "Published", "/admin/projects?status=published"],
          [drafts, "Drafts", "/admin/projects?status=draft"],
          [unreadInquiries, "Unread inquiries", "/admin/inquiries"],
        ].map(([n, label, href], i) => (
          <Link
            key={label}
            to={href}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <motion.div
              className="stat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
            >
              <b>{n}</b>
              <span>{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Studio Direct Channels & Contact Information */}
      <div className="admin-card" style={{ marginBottom: "1.4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", margin: 0, fontSize: "1.2rem" }}>
              Studio Direct Channels
            </h2>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
              Official contact coordinates synced with MongoDB Atlas and public website.
            </span>
          </div>
          <Link
            to="/admin/profile"
            style={{ fontSize: "0.74rem", textDecoration: "underline", color: "var(--sand)", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            Edit in Profile <HiArrowUpRight />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "0.85rem",
          }}
        >
          {/* Email Card */}
          <a
            href={`mailto:${profile.email}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--dark-border)",
              borderRadius: "4px",
              padding: "0.85rem 1rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(0, 70, 67, 0.3)", display: "grid", placeItems: "center" }}>
              <HiOutlineEnvelope size={20} style={{ color: "var(--sand)" }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>
                Email Client
              </span>
              <strong style={{ fontSize: "0.85rem", color: "var(--stone)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {profile.email || "—"}
              </strong>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--sand)" }}>↗</span>
          </a>

          {/* WhatsApp Card */}
          <a
            href={whatsappUrl ? `${whatsappUrl}?text=${encodeURIComponent("Hello from ArjuVisuals Admin")}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--dark-border)",
              borderRadius: "4px",
              padding: "0.85rem 1rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(37, 211, 102, 0.15)", display: "grid", placeItems: "center" }}>
              <FaWhatsapp size={20} style={{ color: "#25D366" }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>
                WhatsApp Direct
              </span>
              <strong style={{ fontSize: "0.85rem", color: "var(--stone)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {profile.whatsapp || profile.phone || "—"}
              </strong>
            </div>
            <span style={{ fontSize: "0.72rem", color: "#25D366" }}>↗</span>
          </a>

          {/* Phone Card */}
          <a
            href={`tel:${profile.phone}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--dark-border)",
              borderRadius: "4px",
              padding: "0.85rem 1rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(0, 70, 67, 0.3)", display: "grid", placeItems: "center" }}>
              <HiOutlinePhone size={20} style={{ color: "var(--sand)" }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>
                Telephone Call
              </span>
              <strong style={{ fontSize: "0.85rem", color: "var(--stone)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {profile.phone || "—"}
              </strong>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--sand)" }}>↗</span>
          </a>

          {/* Instagram Card */}
          <a
            href={instagramUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--dark-border)",
              borderRadius: "4px",
              padding: "0.85rem 1rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(225, 48, 108, 0.15)", display: "grid", placeItems: "center" }}>
              <FaInstagram size={20} style={{ color: "#E1306C" }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>
                Instagram
              </span>
              <strong style={{ fontSize: "0.85rem", color: "var(--stone)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {profile.instagram || "@arjuvisuals"}
              </strong>
            </div>
            <span style={{ fontSize: "0.72rem", color: "#E1306C" }}>↗</span>
          </a>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", margin: 0 }}>
            Recently listed
          </h2>
          <Link to="/admin/projects" style={{ fontSize: "0.74rem", textDecoration: "underline", color: "var(--muted)" }}>
            View all ({total}) →
          </Link>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Project</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 7).map((p) => {
              const isVideo = p.type === "videography";
              return (
                <tr key={p.id}>
                  <td>
                    <span className={`pill ${isVideo ? "video" : "photo"}`}>
                      {isVideo ? "VIDEO" : "PHOTO"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/projects/${p.id}/edit`} style={{ fontWeight: 500, color: "var(--stone)" }}>
                      {p.title}
                    </Link>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <span className={`pill ${p.status === "published" ? "pub" : "draft"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        <Link to="/admin/projects" className="btn btn-outline" style={{ borderColor: "var(--sand)", color: "var(--sand)" }}>
          Manage projects
        </Link>
        <Link to="/admin/services" className="btn btn-outline" style={{ borderColor: "var(--sand)", color: "var(--sand)" }}>
          Manage services
        </Link>
        <Link to="/admin/photographs" className="btn btn-outline" style={{ borderColor: "var(--sand)", color: "var(--sand)" }}>
          Manage photos &amp; stills
        </Link>
        <Link to="/admin/profile" className="btn btn-outline" style={{ borderColor: "var(--sand)", color: "var(--sand)" }}>
          Edit profile
        </Link>
        <Link to="/admin/inquiries" className="btn btn-outline" style={{ borderColor: "var(--sand)", color: "var(--sand)" }}>
          Review inquiries
        </Link>
        <Link to="/" className="btn btn-outline" style={{ borderColor: "var(--sand)", color: "var(--sand)" }}>
          View site
        </Link>
      </div>
    </>
  );
}
