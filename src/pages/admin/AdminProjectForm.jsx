import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { projectService } from "../../services/projectService";
import { PHOTOGRAPHY_CATEGORIES, VIDEOGRAPHY_CATEGORIES } from "../../data/projects";
import { getVideoEmbedInfo } from "../../utils/projectFilters";
import { saveDeviceVideoFile, resolveVideoUrl, formatBytes } from "../../utils/videoStorage";
import { useToast } from "../../context/ToastContext";
import { compressImageFile } from "../../utils/imageUtils";

const blank = {
  title: "",
  slug: "",
  type: "photography",
  category: PHOTOGRAPHY_CATEGORIES[0],
  short: "",
  description: "",
  location: "",
  shootDate: "",
  cover: "",
  gallery: [],
  videoUrl: "",
  videoProvider: "auto",
  duration: "",
  featured: false,
  status: "draft",
  placeholder: false,
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState({ name: "", size: 0 });

  useEffect(() => {
    if (!isNew) {
      projectService.getById(id).then(async (p) => {
        if (p) {
          const projectType = p.type || "photography";
          setForm({
            ...blank,
            ...p,
            type: projectType,
            category:
              p.category ||
              (projectType === "videography"
                ? VIDEOGRAPHY_CATEGORIES[0]
                : PHOTOGRAPHY_CATEGORIES[0]),
            gallery: p.gallery || [],
          });

          if (projectType === "videography" && p.videoUrl) {
            const activePlayable = await resolveVideoUrl(p.videoUrl);
            setVideoPreviewUrl(activePlayable);
          }
        }
      });
    }
  }, [id, isNew]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTypeSwitch = (newType) => {
    if (newType === form.type) return;
    setForm((prev) => {
      let nextCategory = prev.category;
      if (newType === "videography" && !VIDEOGRAPHY_CATEGORIES.includes(prev.category)) {
        nextCategory = VIDEOGRAPHY_CATEGORIES[0];
      } else if (newType === "photography" && !PHOTOGRAPHY_CATEGORIES.includes(prev.category)) {
        nextCategory = PHOTOGRAPHY_CATEGORIES[0];
      }
      return {
        ...prev,
        type: newType,
        category: nextCategory,
      };
    });
  };

  const onTitle = (v) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: f.slug && !isNew ? f.slug : projectService.slugify(v),
    }));
  };

  const onFiles = async (files, kind) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setProcessing(true);
    try {
      const urls = await Promise.all(
        list.map((file) => compressImageFile(file, 1600, 1600, 0.82))
      );
      if (kind === "cover") set("cover", urls[0]);
      else set("gallery", [...form.gallery, ...urls]);
      toast.push("Image(s) processed and added.");
    } catch {
      toast.push("Could not process selected image(s).", "err");
    } finally {
      setProcessing(false);
    }
  };

  const onVideoDeviceFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploading(true);
    try {
      const res = await saveDeviceVideoFile(file);
      setForm((prev) => ({
        ...prev,
        videoUrl: res.uri,
        videoProvider: "device",
        title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      }));
      setVideoPreviewUrl(res.objectUrl);
      setVideoInfo({ name: res.fileName, size: res.fileSize });
      toast.push(`Video loaded from device: ${file.name} (${formatBytes(file.size)})`);
    } catch {
      toast.push("Could not process video file from device.", "err");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSave = async (targetStatus) => {
    const statusToApply = targetStatus || form.status || "draft";
    const payload = {
      ...form,
      status: statusToApply,
      placeholder: false, // Explicitly saved or edited project
    };

    if (statusToApply === "draft") {
      // Minimal validation for drafts
      const draftErrs = {};
      if (!payload.title.trim()) {
        draftErrs.title = "Project title is required to save a draft.";
      }
      if (!payload.slug.trim()) {
        draftErrs.slug = "Slug is required.";
      }
      setErrors(draftErrs);
      if (Object.keys(draftErrs).length) {
        toast.push("Please provide a title to save draft.", "err");
        return;
      }

      setProcessing(true);
      try {
        if (isNew) await projectService.create(payload);
        else await projectService.update(id, payload);
        toast.push("Project saved as Draft. It remains hidden from the public website.");
        navigate("/admin/projects?status=draft");
      } catch {
        toast.push("Could not save draft.", "err");
      } finally {
        setProcessing(false);
      }
      return;
    }

    // Full validation for publishing
    const pubErrs = {};
    if (!payload.title.trim()) pubErrs.title = "Project title is required.";
    if (!payload.slug.trim()) pubErrs.slug = "Slug is required.";
    if (!payload.short.trim()) pubErrs.short = "Short summary / glance is required.";
    if (!payload.cover) {
      pubErrs.cover =
        payload.type === "videography"
          ? "A video thumbnail / cover poster is required."
          : "A cover photograph is required.";
    }

    if (payload.type === "videography") {
      if (!payload.videoUrl.trim()) {
        pubErrs.videoUrl = "Please provide a video URL or upload a video file before publishing.";
      } else {
        const info = getVideoEmbedInfo(payload.videoUrl, payload.videoProvider);
        if (info.type === "none") {
          pubErrs.videoUrl = "Please provide a supported YouTube, Vimeo, or direct video file.";
        }
      }
    }

    setErrors(pubErrs);
    if (Object.keys(pubErrs).length) {
      toast.push("Please resolve the required fields before publishing.", "err");
      return;
    }

    setProcessing(true);
    try {
      if (isNew) await projectService.create(payload);
      else await projectService.update(id, payload);
      toast.push(`Project published! It is now live under ${payload.category}.`);
      navigate("/admin/projects?status=published");
    } catch {
      toast.push("Could not publish project.", "err");
    } finally {
      setProcessing(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    await handleSave(form.status);
  };

  const isVideo = form.type === "videography";
  const activeCategoryList = isVideo ? VIDEOGRAPHY_CATEGORIES : PHOTOGRAPHY_CATEGORIES;
  const embedInfo = isVideo ? getVideoEmbedInfo(videoPreviewUrl || form.videoUrl, form.videoProvider) : null;

  return (
    <>
      <SEO title={isNew ? "New project" : "Edit project"} />
      <div className="admin-top">
        <h1>{isNew ? "NEW PROJECT" : "EDIT PROJECT"}</h1>
        <Link
          to="/admin/projects"
          className="btn btn-outline"
          style={{ borderColor: "var(--sand)", color: "var(--sand)" }}
        >
          Back
        </Link>
      </div>

      <div className="demo-banner">
        Configure <strong>{isVideo ? "Videography" : "Photography"}</strong> project details.
        Videos can be uploaded directly from device or embedded via YouTube/Vimeo.
      </div>

      <form className="admin-card form-grid" onSubmit={save}>
        {/* Top Control Bar: Project Type & Project Status */}
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          {/* Project Type */}
          <div className="field" style={{ flex: 1, minWidth: 260 }}>
            <label style={{ display: "block", marginBottom: "0.6rem" }}>
              Project Type <span className="req">*</span>
            </label>
            <div className="admin-type-tabs" role="radiogroup" aria-label="Project Type">
              <button
                type="button"
                role="radio"
                aria-checked={!isVideo}
                className={`admin-type-btn ${!isVideo ? "active" : ""}`}
                onClick={() => handleTypeSwitch("photography")}
              >
                📷 Photography
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={isVideo}
                className={`admin-type-btn ${isVideo ? "active" : ""}`}
                onClick={() => handleTypeSwitch("videography")}
              >
                🎬 Videography
              </button>
            </div>
          </div>

          {/* Project Status */}
          <div className="field" style={{ flex: 1, minWidth: 280 }}>
            <label style={{ display: "block", marginBottom: "0.6rem" }}>
              Project Status <span className="req">*</span>
            </label>
            <div className="admin-type-tabs" role="radiogroup" aria-label="Project Status">
              <button
                type="button"
                role="radio"
                aria-checked={form.status === "draft"}
                className={`admin-type-btn ${form.status === "draft" ? "active" : ""}`}
                onClick={() => set("status", "draft")}
              >
                ✎ Draft
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={form.status === "published"}
                className={`admin-type-btn ${form.status === "published" ? "active" : ""}`}
                onClick={() => set("status", "published")}
              >
                ✓ Published
              </button>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.35rem", display: "block" }}>
              {form.status === "draft"
                ? "Draft projects remain hidden from the public website until published."
                : `Published projects are immediately live in ${form.category}.`}
            </span>
          </div>
        </div>

        {/* Title and Slug */}
        <div className="form-row">
          <div className="field">
            <label>
              Project Title <span className="req">*</span>
            </label>
            <input value={form.title} onChange={(e) => onTitle(e.target.value)} />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>
          <div className="field">
            <label>
              Slug <span className="req">*</span>
            </label>
            <input
              value={form.slug}
              onChange={(e) => set("slug", projectService.slugify(e.target.value))}
            />
            {errors.slug && <div className="error">{errors.slug}</div>}
          </div>
        </div>

        {/* Category and Location */}
        <div className="form-row">
          <div className="field">
            <label>
              {isVideo ? "Video Category" : "Photography Discipline"} <span className="req">*</span>
            </label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {activeCategoryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Location / Region</label>
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Thrissur, Kerala"
            />
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--muted)",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              Appears on card and project detail (e.g. {form.category} · {form.location || "Kerala"})
            </span>
          </div>
        </div>

        {/* Video Specific Fields */}
        {isVideo && (
          <div
            style={{
              background: "rgba(0, 70, 67, 0.18)",
              padding: "1.2rem",
              borderRadius: "4px",
              border: "1px solid rgba(168, 230, 207, 0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontWeight: 600, color: "#a8e6cf", margin: 0 }}>
                Video Source (Device File or URL) {form.status === "published" && <span className="req">*</span>}
              </label>
              {videoInfo.name && (
                <span style={{ fontSize: "0.72rem", color: "#a8e6cf", opacity: 0.9 }}>
                  Selected: {videoInfo.name} ({formatBytes(videoInfo.size)})
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
              {/* Device file upload button */}
              <label
                htmlFor="device-video-file-input"
                className="btn btn-outline"
                style={{
                  borderColor: "rgba(168, 230, 207, 0.5)",
                  color: "#a8e6cf",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.55rem 1rem",
                  fontSize: "0.76rem",
                }}
              >
                <span>📁</span> {videoUploading ? "Reading video..." : "Choose video from device"}
              </label>
              <input
                id="device-video-file-input"
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                onChange={onVideoDeviceFile}
                disabled={videoUploading}
                style={{ display: "none" }}
              />
              <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                Supports MP4, WebM, MOV video files directly from your computer or phone.
              </span>
            </div>

            <div className="form-row" style={{ marginTop: "0.2rem" }}>
              <div className="field" style={{ flex: 2 }}>
                <label style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Or paste online video URL (YouTube, Vimeo, or direct MP4 stream)
                </label>
                <input
                  value={form.videoUrl}
                  onChange={(e) => {
                    set("videoUrl", e.target.value);
                    setVideoPreviewUrl(e.target.value);
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or .mp4 URL"
                />
                {errors.videoUrl && <div className="error">{errors.videoUrl}</div>}
              </div>

              <div className="field" style={{ flex: 1 }}>
                <label>Platform / Provider</label>
                <select
                  value={form.videoProvider}
                  onChange={(e) => set("videoProvider", e.target.value)}
                >
                  <option value="auto">Auto-detect from source</option>
                  <option value="device">Device upload</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="mp4">Direct MP4/WebM stream</option>
                </select>
              </div>

              <div className="field" style={{ flex: 1 }}>
                <label>Duration</label>
                <input
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="e.g. 03:40 or 1m 30s"
                />
              </div>
            </div>

            {/* Live Video Preview Box */}
            {form.videoUrl && embedInfo && (
              <div style={{ marginTop: "0.4rem" }}>
                <label style={{ fontSize: "0.72rem", color: "var(--stone)", marginBottom: "0.35rem", display: "block" }}>
                  Live Video Playback Preview
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 520,
                    aspectRatio: "16 / 9",
                    background: "#0c0203",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid rgba(241, 235, 235, 0.15)",
                  }}
                >
                  {embedInfo.type === "video" || form.videoUrl.startsWith("blob:") || form.videoUrl.startsWith("idb://") ? (
                    <video
                      controls
                      playsInline
                      src={videoPreviewUrl || form.videoUrl}
                      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
                    />
                  ) : embedInfo.type === "youtube" || embedInfo.type === "vimeo" ? (
                    <iframe
                      src={embedInfo.embedUrl}
                      title="Preview"
                      style={{ width: "100%", height: "100%", border: 0 }}
                      allowFullScreen
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Date and Status */}
        <div className="form-row">
          <div className="field">
            <label>Shoot / Production Date</label>
            <input
              type="date"
              value={form.shootDate || ""}
              onChange={(e) => set("shootDate", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Publication Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="published">Published (Visible on site)</option>
              <option value="draft">Draft (Admin only)</option>
            </select>
          </div>
        </div>

        {/* Descriptions */}
        <div className="field">
          <label>
            Short Editorial Tagline <span className="req">*</span>
          </label>
          <input
            value={form.short}
            onChange={(e) => set("short", e.target.value)}
            placeholder="One compelling sentence describing the concept"
          />
          {errors.short && <div className="error">{errors.short}</div>}
        </div>

        <div className="field">
          <label>Full Project Story / Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="Detailed narrative about lighting, gear, direction, and story..."
          />
        </div>

        {/* Cover Thumbnail */}
        <div className="field">
          <label>
            {isVideo ? "Video Thumbnail / Poster Image" : "Cover Photograph"}{" "}
            <span className="req">*</span>
          </label>
          <input
            value={form.cover}
            onChange={(e) => set("cover", e.target.value)}
            placeholder="Paste image URL"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFiles(e.target.files, "cover")}
            style={{ marginTop: "0.6rem" }}
          />
          {form.cover && (
            <img
              src={form.cover}
              alt=""
              style={{ marginTop: "0.6rem", maxHeight: 180, borderRadius: 2 }}
            />
          )}
          {errors.cover && <div className="error">{errors.cover}</div>}
        </div>

        {/* Gallery / Stills */}
        <div className="field">
          <label>
            {isVideo
              ? `Production Stills & Behind the Scenes (${form.gallery.length} photos)`
              : `Gallery Photographs (${form.gallery.length} frames)`}
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={processing}
              onChange={(e) => onFiles(e.target.files, "gallery")}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              placeholder={
                isVideo
                  ? "Or paste still photo URL"
                  : "Or paste photo URL to add to gallery"
              }
              value={galleryUrl}
              onChange={(e) => setGalleryUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (galleryUrl.trim()) {
                    set("gallery", [...form.gallery, galleryUrl.trim()]);
                    setGalleryUrl("");
                  }
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (galleryUrl.trim()) {
                  set("gallery", [...form.gallery, galleryUrl.trim()]);
                  setGalleryUrl("");
                }
              }}
              style={{
                borderColor: "var(--sand)",
                color: "var(--sand)",
                padding: "0.55rem 0.9rem",
                whiteSpace: "nowrap",
              }}
            >
              Add URL
            </button>
          </div>
          <div className="thumbs" style={{ marginTop: "0.6rem" }}>
            {form.gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => set("gallery", form.gallery.filter((_, idx) => idx !== i))}
                title="Click to remove from gallery"
                style={{ padding: 0, border: 0, background: "none", position: "relative" }}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Featured checkbox */}
        <label style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured on the home page ({isVideo ? "Featured Videography" : "Featured Photography"})
        </label>

        {/* Two Clear Action Buttons: Save as Draft and Publish Project */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
            paddingTop: "1.4rem",
            marginTop: "0.6rem",
            borderTop: "1px solid var(--dark-border)",
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            disabled={processing || videoUploading}
            onClick={() => handleSave("draft")}
            style={{
              borderColor: "var(--sand)",
              color: "var(--sand)",
              padding: "0.75rem 1.6rem",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            ✎ Save as Draft
          </button>

          <button
            type="button"
            className="btn btn-sand"
            disabled={processing || videoUploading}
            onClick={() => handleSave("published")}
            style={{
              padding: "0.75rem 1.8rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✓ Publish Project
          </button>

          <Link
            to="/admin/projects"
            style={{
              color: "var(--muted)",
              fontSize: "0.8rem",
              marginLeft: "auto",
              textDecoration: "underline",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
