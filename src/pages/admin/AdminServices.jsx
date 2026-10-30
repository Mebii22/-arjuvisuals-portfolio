import { useEffect, useState } from "react";
import SEO from "../../components/SEO";
import { serviceService } from "../../services/serviceService";
import { useToast } from "../../context/ToastContext";
import { compressImageFile } from "../../utils/imageUtils";

const blank = {
  title: "",
  description: "",
  cover: "",
  featuresText: "",
  startingPrice: "",
  published: true,
};

export default function AdminServices() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [processing, setProcessing] = useState(false);

  const load = () => serviceService.list({ includeHidden: true }).then(setList);
  useEffect(() => {
    load();
  }, []);

  const onCoverFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await compressImageFile(file, 1600, 1600, 0.82);
      setForm((f) => ({ ...f, cover: dataUrl }));
      toast.push("Service cover image updated.");
    } catch {
      toast.push("Could not process service cover image.", "err");
    } finally {
      setProcessing(false);
    }
  };

  const startEdit = (s) => {
    setEditing(s.id);
    setForm({
      title: s.title,
      description: s.description,
      cover: s.cover,
      featuresText: (s.features || []).join("\n"),
      startingPrice: s.startingPrice || "",
      published: s.published,
    });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.push("A service title is required.", "err");
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      cover: form.cover,
      features: form.featuresText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      startingPrice: form.startingPrice,
      published: form.published,
    };
    if (editing) await serviceService.update(editing, payload);
    else await serviceService.create(payload);
    toast.push("Service saved in local demo storage.");
    setForm(blank);
    setEditing(null);
    load();
  };

  return (
    <>
      <SEO title="Services" />
      <div className="admin-top">
        <h1>SERVICES</h1>
      </div>
      <div className="demo-banner">
        Do not invent prices. Leave starting price empty unless Arjun has confirmed a figure.
      </div>

      <form className="admin-card form-grid" onSubmit={save}>
        <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
          {editing ? "Edit service" : "Add a service"}
        </h2>
        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="field">
          <label>Cover image {processing ? "(Processing…)" : ""}</label>
          <input
            placeholder="Image URL"
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
          <textarea value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} />
        </div>
        <div className="field">
          <label>Starting price (optional)</label>
          <input
            value={form.startingPrice}
            onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
            placeholder="Leave blank if not confirmed"
          />
        </div>
        <label style={{ display: "flex", gap: "0.6rem" }}>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published on the public site
        </label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button className="btn btn-sand" type="submit">
            {editing ? "Update" : "Add service"}
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

      {list.map((s) => (
        <article key={s.id} className="admin-card" style={{ display: "grid", gridTemplateColumns: "88px 1fr auto", gap: "1rem", alignItems: "center" }}>
          <img src={s.cover} alt="" style={{ width: 88, height: 64, objectFit: "cover" }} />
          <div>
            <strong>{s.title}</strong>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              {s.published ? "Published" : "Hidden"}
              {s.startingPrice ? ` · ${s.startingPrice}` : ""}
            </div>
          </div>
          <div className="admin-actions">
            <button type="button" onClick={() => startEdit(s)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={() => setConfirm(s)}>
              Delete
            </button>
          </div>
        </article>
      ))}

      {confirm && (
        <div className="modal-back" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="editorial" style={{ fontSize: "1.6rem" }}>
              Remove {confirm.title}?
            </h2>
            <p style={{ color: "var(--muted)", margin: "0.8rem 0 1.2rem" }}>Local demo delete only.</p>
            <div className="admin-actions">
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  await serviceService.remove(confirm.id);
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
