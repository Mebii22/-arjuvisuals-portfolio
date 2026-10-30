import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import { projectService } from "../../services/projectService";
import { inquiryService } from "../../services/inquiryService";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    projectService.list({ includeDrafts: true }).then(setProjects);
    inquiryService.list().then(setInquiries);
  }, []);

  const total = projects.length;
  const photography = projects.filter((p) => (p.type || "photography") === "photography").length;
  const videography = projects.filter((p) => p.type === "videography").length;
  const published = projects.filter((p) => p.status === "published").length;
  const drafts = projects.filter((p) => p.status === "draft").length;
  const fresh = inquiries.filter((i) => i.status === "new").length;

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
        <strong>Arjun Murali — sole administrator.</strong> Live portfolio metrics for commercial photography & videography.
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
        {[
          [total, "Total projects", "/admin/projects"],
          [photography, "Photography", "/admin/projects"],
          [videography, "Videography", "/admin/projects"],
          [published, "Published", "/admin/projects?status=published"],
          [drafts, "Drafts", "/admin/projects?status=draft"],
          [fresh, "New inquiries", "/admin/inquiries"],
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
        <Link to="/admin/photographs" className="btn btn-outline" style={{ borderColor: "var(--sand)", color: "var(--sand)" }}>
          Manage photos & stills
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
