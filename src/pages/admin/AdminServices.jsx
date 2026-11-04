import { useEffect, useMemo, useState } from "react";
import SEO from "../../components/SEO";
import { serviceService } from "../../services/serviceService";
import { API_CONFIG, apiRequest } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { compressImageFile } from "../../utils/imageUtils";

const blank = {
  title: "",
  description: "",
  category: "photography",
  cover: "",
  featuresText: "",
  startingPrice: "",
  status: "published",
  published: true,
};

export default function AdminServices() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const load = async () => {
    try {
      const data = await serviceService.list({ includeHidden: true });
      setList(data);
    } catch {
      toast.push("Could not load services.", "err");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const total = list.length;
    const published = list.filter((s) => s.status === "published").length;
    const drafts = list.filter((s) => s.status === "draft").length;
    const photography = list.filter((s) => s.category === "photography").length;
    const videography = list.filter((s) => s.category === "videography").length;
    return { total, published, drafts, photography, videography };
  }, [list]);

  const filteredList = useMemo(() => {
    return list.filter((s) => {
      if (statusFilter === "published" && s.status !== "published") return false;
      if (statusFilter === "draft" && s.status !== "draft") return false;
      if (typeFilter !== "all" && s.category !== typeFilter) return false;
      return true;
    });
  }, [list, statusFilter, typeFilter]);

  const onCoverFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      if (API_CONFIG.USE_API) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiRequest("/upload", {
          method: "POST",
          body: formData,
        });
        const url = res.url || (res.data && res.data.url);
        setForm((f) => ({ ...f, cover: url }));
        toast.push("Service cover image uploaded.");
      } else {
        const dataUrl = await compressImageFile(file, 1600, 1600, 0.82);
        setForm((f) => ({ ...f, cover: dataUrl }));
        toast.push("Service cover image processed.");
      }
    } catch (err) {
      toast.push(err.message || "Could not process service cover image.", "err");
    } finally {
      setProcessing(false);
    }
  };

  const startEdit = (s) => {
    setEditing(s.id || s._id);
    setForm({
      title: s.title,
      description: s.description,
      category: s.category || "photography",
      cover: s.cover || "",
      featuresText: (s.features || []).join("\n"),
      startingPrice: s.startingPrice || "",
      status: s.status || (s.published ? "published" : "draft"),
      published: s.status === "published" || s.published === true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publishService = async (s) => {
    try {
      await serviceService.publish(s.id || s._id);
      toast.push(`Service “${s.title}” is now published and live.`);
      await load();
    } catch (err) {
      toast.push(err.message || "Could not publish service.", "err");
    }
  };

  const unpublishService = async (s) => {
    try {
      await serviceService.unpublish(s.id || s._id);
      toast.push(`Service “${s.title}” moved to drafts.`);
      await load();
    } catch (err) {
      toast.push(err.message || "Could not unpublish service.", "err");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.push("A service title is required.", "err");
      return;
    }
    if (!form.description.trim()) {
      toast.push("A service description is required.", "err");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      cover: form.cover.trim(),
      features: form.featuresText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      startingPrice: form.startingPrice.trim(),
      status: form.published ? "published" : "draft",
      published: form.published,
    };

    try {
      if (editing) {
        await serviceService.update(editing, payload);
        toast.push(`Service “${payload.title}” updated.`);
      } else {
        await serviceService.create(payload);
        toast.push(`Service “${payload.title}” created.`);
      }
      setForm(blank);
      setEditing(null);
      await load();
    } catch (err) {
      toast.push(err.message || "Could not save service.", "err");
    }
  };

  return (
    <>
      <SEO title="Services" />
      <div className="admin-top">
        <h1>SERVICES</h1>
      </div>
      <div className="demo-banner">
        Manage Arjun Murali’s service offerings for photography and videography. Draft services remain hidden from the public website.
      </div>

      <form className="admin-card form-grid" onSubmit={save}>
        <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
          {editing ? "Edit service" : "Add a service"}
        </h2>
        <div className="field">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Wedding Films or Architectural Photography"
          />
        </div>
        <div className="field">
          <label>Category / Medium</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="photography">Photography</option>
            <option value="videography">Videography</option>
          </select>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the discipline, aesthetic approach, and client experience..."
          />
        </div>
        <div className="field">
          <label>Cover image {processing ? "(Processing…)" : ""}</label>
          <input
            placeholder="Image URL or upload below"
            value={form.cover}
            onChange={(e) => setForm({ ...form, cover: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            disabled={processing}
            onChange={onCoverFile}
            style={{ marginTop: "0.5rem" }}
          />
          {form.cover && (
            <img
              src={form.cover}
              alt="Service preview"
              style={{ marginTop: "0.6rem", width: 120, height: 80, objectFit: "cover", borderRadius: "4px" }}
            />
          )}
        </div>
        <div className="field">
          <label>Features (one per line)</label>
          <textarea
            value={form.featuresText}
            onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
            placeholder="Key offerings, deliverables, or highlights..."
          />
        </div>
        <div className="field">
          <label>Starting price (optional)</label>
          <input
            value={form.startingPrice}
            onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
            placeholder="Leave blank if not confirmed"
          />
        </div>
        <label style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          <span>Published on the public site (uncheck to save as Draft)</span>
        </label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button className="btn btn-sand" type="submit">
            {editing ? "Update Service" : "Add Service"}
          </button>
          {editing && (
            <button
              className="btn btn-outline"
              type="button"
              style={{ borderColor: "var(--sand)", color: "var(--sand)" }}
              onClick={() => {
                setEditing(null);
                setForm(blank);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filter Tabs Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", margin: "1.5rem 0 1.2rem" }}>
        {/* Status Filter Tabs */}
        <div>
          <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
            Publication Status
          </label>
          <div className="admin-type-tabs" role="tablist" aria-label="Filter by service status">
            <button
              type="button"
              className={`admin-type-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All Services ({counts.total})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${statusFilter === "published" ? "active" : ""}`}
              onClick={() => setStatusFilter("published")}
            >
              ✓ Published ({counts.published})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${statusFilter === "draft" ? "active" : ""}`}
              onClick={() => setStatusFilter("draft")}
            >
              ✎ Drafts ({counts.drafts})
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div>
          <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
            Category / Medium
          </label>
          <div className="admin-type-tabs" role="tablist" aria-label="Filter by service category">
            <button
              type="button"
              className={`admin-type-btn ${typeFilter === "all" ? "active" : ""}`}
              onClick={() => setTypeFilter("all")}
            >
              All Offerings ({counts.total})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${typeFilter === "photography" ? "active" : ""}`}
              onClick={() => setTypeFilter("photography")}
            >
              📷 Photography ({counts.photography})
            </button>
            <button
              type="button"
              className={`admin-type-btn ${typeFilter === "videography" ? "active" : ""}`}
              onClick={() => setTypeFilter("videography")}
            >
              🎬 Videography ({counts.videography})
            </button>
          </div>
        </div>
      </div>

      {filteredList.map((s) => (
        <article
          key={s.id || s._id}
          className="admin-card"
          style={{
            display: "grid",
            gridTemplateColumns: "88px 1fr auto",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "0.8rem",
          }}
        >
          <img
            src={s.cover || "/images/placeholders/image-placeholder.svg"}
            alt=""
            style={{ width: 88, height: 64, objectFit: "cover", borderRadius: "4px" }}
          />
          <div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.3rem", flexWrap: "wrap" }}>
              <span className={`pill ${s.category === "videography" ? "video" : "photo"}`}>
                {s.category === "videography" ? "VIDEO" : "PHOTO"}
              </span>
              <span className={`pill ${s.status === "published" ? "pub" : "draft"}`}>
                {s.status === "published" ? "PUBLISHED" : "DRAFT"}
              </span>
              <strong style={{ fontSize: "1rem" }}>{s.title}</strong>
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              {s.description ? `${s.description.slice(0, 95)}...` : ""}
              {s.startingPrice ? ` · From ${s.startingPrice}` : ""}
            </div>
          </div>
          <div className="admin-actions">
            {s.status === "published" ? (
              <button type="button" onClick={() => unpublishService(s)}>
                Unpublish
              </button>
            ) : (
              <button type="button" onClick={() => publishService(s)}>
                Publish
              </button>
            )}
            <button type="button" onClick={() => startEdit(s)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={() => setConfirm(s)}>
              Delete
            </button>
          </div>
        </article>
      ))}

      {filteredList.length === 0 && (
        <div className="empty-state" style={{ padding: "3rem 1rem", textAlign: "center" }}>
          No services match the selected filter.
        </div>
      )}

      {confirm && (
        <div className="modal-back" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="editorial" style={{ fontSize: "1.6rem" }}>
              Remove {confirm.title}?
            </h2>
            <p style={{ color: "var(--muted)", margin: "0.8rem 0 1.2rem" }}>
              This will remove the service from both the admin dashboard and public site.
            </p>
            <div className="admin-actions">
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  await serviceService.remove(confirm.id || confirm._id);
                  setConfirm(null);
                  toast.push("Service removed.");
                  load();
                }}
              >
                Delete
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
