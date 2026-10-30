import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { projectService } from "../../services/projectService";
import { getCategoriesForType } from "../../utils/projectFilters";
import { useToast } from "../../context/ToastContext";

export default function AdminProjects() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cat, setCat] = useState("all");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [confirm, setConfirm] = useState(null);

  const load = () => projectService.list({ includeDrafts: true }).then(setProjects);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const s = searchParams.get("status");
    if (s && ["all", "published", "draft"].includes(s)) {
      setStatusFilter(s);
    }
  }, [searchParams]);

  const handleTypeChange = (newType) => {
    setTypeFilter(newType);
    setCat("all"); // reset category filter on type change
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newStatus === "all") next.delete("status");
      else next.set("status", newStatus);
      return next;
    });
  };

  const availableCategories = useMemo(() => {
    return getCategoriesForType(typeFilter, projects);
  }, [typeFilter, projects]);

  const counts = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => p.status === "published").length;
    const drafts = projects.filter((p) => p.status === "draft").length;
    return { total, published, drafts };
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const pType = p.type || "photography";
      if (typeFilter !== "all" && pType !== typeFilter) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (q && !`${p.title} ${p.location || ""} ${p.category || ""}`.toLowerCase().includes(q.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [projects, q, typeFilter, cat, statusFilter]);

  const publishProject = async (p) => {
    await projectService.publish(p.id);
    toast.push(`Project “${p.title}” is now published and live.`);
    load();
  };

  const unpublishProject = async (p) => {
    await projectService.unpublish(p.id);
    toast.push(`Project “${p.title}” unpublished and moved to drafts.`);
    load();
  };

  const toggleFeatured = async (p) => {
    await projectService.update(p.id, {
      featured: !p.featured,
    });
    toast.push(`Project ${!p.featured ? "marked as featured" : "removed from featured"}.`);
    load();
  };

  const remove = async (id) => {
    await projectService.remove(id);
    setConfirm(null);
    toast.push("Project deleted from local storage.");
    load();
  };

  return (
    <>
      <SEO title="Projects" />
      <div className="admin-top">
        <h1>PROJECTS</h1>
        <Link to="/admin/projects/new" className="btn btn-sand">
          + Add project
        </Link>
      </div>

      <div className="demo-banner">
        Manage Arjun Murali’s portfolio works. Draft projects remain safely hidden from the public website until you publish them.
      </div>

      {/* Filter Tabs Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.2rem" }}>
        {/* Status Filter Tabs */}
        <div>
          <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
            Publication Status
          </label>
          <div className="admin-type-tabs" role="tablist" aria-label="Filter by project status">
            <button
              type="button"
              className={`admin-type-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => handleStatusFilterChange("all")}
            >
              All Projects ({counts.total})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${statusFilter === "published" ? "active" : ""}`}
              onClick={() => handleStatusFilterChange("published")}
            >
              ✓ Published ({counts.published})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${statusFilter === "draft" ? "active" : ""}`}
              onClick={() => handleStatusFilterChange("draft")}
            >
              ✎ Drafts ({counts.drafts})
            </button>
          </div>
        </div>

        {/* Primary Type Filter Tabs */}
        <div>
          <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
            Medium / Type
          </label>
          <div className="admin-type-tabs" role="tablist" aria-label="Filter by project type">
            <button
              type="button"
              className={`admin-type-btn ${typeFilter === "all" ? "active" : ""}`}
              onClick={() => handleTypeChange("all")}
            >
              All Works ({projects.length})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${typeFilter === "photography" ? "active" : ""}`}
              onClick={() => handleTypeChange("photography")}
            >
              📷 Photography ({projects.filter((p) => (p.type || "photography") === "photography").length})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${typeFilter === "videography" ? "active" : ""}`}
              onClick={() => handleTypeChange("videography")}
            >
              🎬 Videography ({projects.filter((p) => p.type === "videography").length})
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Category */}
      <div className="admin-card" style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Search by title, category, or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            background: "transparent",
            border: "1px solid var(--dark-border)",
            color: "var(--stone)",
            padding: "0.55rem 0.7rem",
          }}
        />

        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{
            background: "var(--dark-red-elevated)",
            color: "var(--stone)",
            border: "1px solid var(--dark-border)",
            padding: "0.55rem",
          }}
        >
          <option value="all">All categories</option>
          {availableCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Project Table */}
      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Type</th>
              <th>Title</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const isVideo = p.type === "videography";
              const isPub = p.status === "published";
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ position: "relative", width: 56, height: 42 }}>
                      <img src={p.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {isVideo && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 2,
                            right: 2,
                            background: "rgba(0,0,0,0.75)",
                            color: "#fff",
                            fontSize: "0.55rem",
                            padding: "1px 3px",
                            borderRadius: 2,
                          }}
                        >
                          ▶
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`pill ${isVideo ? "video" : "photo"}`}>
                      {isVideo ? "VIDEO" : "PHOTO"}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.title}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.74rem" }}>
                      /{p.slug} {p.duration ? `· ${p.duration}` : ""}
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(p)}
                      title="Toggle featured status"
                      style={{
                        background: "transparent",
                        border: "1px solid var(--dark-border)",
                        color: p.featured ? "#ffd166" : "var(--muted)",
                        fontSize: "0.72rem",
                        padding: "0.2rem 0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      {p.featured ? "★ Featured" : "☆ Regular"}
                    </button>
                  </td>
                  <td>
                    <span className={`pill ${isPub ? "pub" : "draft"}`}>
                      {isPub ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      {/* 1. Preview */}
                      <Link
                        to={`/portfolio/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={isPub ? "Preview published project" : "Preview draft project"}
                      >
                        Preview
                      </Link>

                      {/* 2. Edit */}
                      <Link to={`/admin/projects/${p.id}/edit`} title="Edit project">
                        Edit
                      </Link>

                      {/* 3 & 4. Publish / Unpublish */}
                      {isPub ? (
                        <button
                          type="button"
                          onClick={() => unpublishProject(p)}
                          title="Unpublish this project (hide from public website)"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => publishProject(p)}
                          style={{ borderColor: "rgba(168, 230, 207, 0.4)", color: "#a8e6cf" }}
                          title="Publish this project to the public portfolio"
                        >
                          Publish
                        </button>
                      )}

                      {/* 5. Delete */}
                      <button
                        type="button"
                        className="danger"
                        onClick={() => setConfirm(p)}
                        title="Delete project"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <p className="empty-state">No projects match the selected filters.</p>}
      </div>

      {/* Delete Confirmation Modal */}
      {confirm && (
        <div className="modal-back" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="editorial" style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>
              Delete “{confirm.title}”?
            </h2>
            <p style={{ color: "var(--muted)", marginBottom: "1.2rem" }}>
              This will remove this {confirm.type === "videography" ? "videography" : "photography"} project from local demo storage.
            </p>
            <div className="admin-actions">
              <button type="button" className="danger" onClick={() => remove(confirm.id)}>
                Delete project
              </button>
              <button type="button" onClick={() => setConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
