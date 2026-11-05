import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { projectService } from "../../services/projectService";
import { disciplineService } from "../../services/disciplineService";
import { API_CONFIG, apiRequest } from "../../services/api";
import { getVideoEmbedInfo } from "../../utils/projectFilters";
import { saveDeviceVideoFile, resolveVideoUrl, formatBytes } from "../../utils/videoStorage";
import { useToast } from "../../context/ToastContext";
import { compressImageFile } from "../../utils/imageUtils";

const blank = {
  title: "",
  slug: "",
  type: "photography",
  category: "Wedding Photography",
  short: "",
  description: "",
  location: "",
  shootDate: "",
  cover: "",
  thumbnail: "",
  gallery: [],
  videoStills: [],
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

  // Dynamic Discipline State
  const [disciplines, setDisciplines] = useState([]);
  const [showAddDiscipline, setShowAddDiscipline] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState("");
  const [addingDiscipline, setAddingDiscipline] = useState(false);

  // Media upload & URL staging states
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [stillsUrlInput, setStillsUrlInput] = useState("");
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingStills, setUploadingStills] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState({ name: "", size: 0 });

  const coverFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);
  const stillsFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);

  // Load disciplines from MongoDB Atlas
  useEffect(() => {
    disciplineService
      .list()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDisciplines(data);
        }
      })
      .catch(() => {});
  }, []);

  // Load project if editing
  useEffect(() => {
    if (!isNew) {
      projectService
        .getById(id)
        .then(async (p) => {
          if (p) {
            const projectType = p.type === "videography" ? "videography" : "photography";
            const coverImg = p.cover || p.thumbnail || p.coverImage || "";
            const stills = Array.isArray(p.videoStills) && p.videoStills.length > 0
              ? p.videoStills
              : (Array.isArray(p.gallery) ? p.gallery : []);

            setForm({
              ...blank,
              ...p,
              type: projectType,
              category: p.category || (projectType === "videography" ? "Cinematic Films" : "Wedding Photography"),
              cover: coverImg,
              thumbnail: p.thumbnail || coverImg,
              gallery: p.gallery || [],
              videoStills: stills,
            });

            if (projectType === "videography" && p.videoUrl) {
              const activePlayable = await resolveVideoUrl(p.videoUrl);
              setVideoPreviewUrl(activePlayable);
            }
          }
        })
        .catch(() => {
          toast.push("Could not load project for editing.", "err");
        });
    }
  }, [id, isNew]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const isVideo = form.type === "videography";

  // Filter disciplines by active project type (photography vs videography)
  const availableDisciplines = useMemo(() => {
    const targetType = form.type;
    const list = disciplines.filter((d) => d.type === targetType).map((d) => d.name);

    // Ensure currently selected category is included if not in list
    if (form.category && !list.includes(form.category)) {
      list.push(form.category);
    }
    return list;
  }, [disciplines, form.type, form.category]);

  // Handle switching between Photography and Videography
  const handleTypeSwitch = (newType) => {
    if (newType === form.type) return;
    setForm((prev) => {
      const typeDisciplines = disciplines.filter((d) => d.type === newType).map((d) => d.name);
      const nextCategory = typeDisciplines[0] || (newType === "videography" ? "Cinematic Films" : "Wedding Photography");
      return {
        ...prev,
        type: newType,
        category: nextCategory,
      };
    });
    setShowAddDiscipline(false);
  };

  const onTitle = (v) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: f.slug && !isNew ? f.slug : projectService.slugify(v),
    }));
  };

  // Upload or process media files (Cover, Gallery, Stills)
  const uploadFilesToCloudinary = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return [];

    if (API_CONFIG.USE_API) {
      return await Promise.all(
        list.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await apiRequest("/upload", {
            method: "POST",
            body: formData,
          });
          return res.url || (res.data && res.data.url);
        })
      );
    } else {
      return await Promise.all(
        list.map((file) => compressImageFile(file, 1600, 1600, 0.85))
      );
    }
  };

  // Cover / Thumbnail File Upload
  const onCoverFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const urls = await uploadFilesToCloudinary([file]);
      if (urls.length > 0 && urls[0]) {
        setForm((prev) => ({
          ...prev,
          cover: urls[0],
          thumbnail: urls[0],
        }));
        toast.push(isVideo ? "Video thumbnail uploaded." : "Cover image uploaded.");
      }
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
    } catch (err) {
      toast.push(err.message || "Failed to upload cover image.", "err");
    } finally {
      setUploadingCover(false);
    }
  };

  // Cover URL manual application
  const applyCoverUrl = () => {
    const clean = coverUrlInput.trim();
    if (!clean) return;
    setForm((prev) => ({
      ...prev,
      cover: clean,
      thumbnail: clean,
    }));
    setCoverUrlInput("");
    toast.push(isVideo ? "Video thumbnail updated." : "Cover image updated.");
  };

  // Gallery Photos File Upload (for Photography)
  const onGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingGallery(true);
    try {
      const urls = await uploadFilesToCloudinary(files);
      const valid = urls.filter(Boolean);
      if (valid.length > 0) {
        setForm((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...valid],
        }));
        toast.push(`${valid.length} photograph(s) added to gallery.`);
      }
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
    } catch (err) {
      toast.push(err.message || "Failed to upload gallery images.", "err");
    } finally {
      setUploadingGallery(false);
    }
  };

  const addGalleryUrl = () => {
    const clean = galleryUrlInput.trim();
    if (!clean) return;
    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, clean],
    }));
    setGalleryUrlInput("");
    toast.push("Photo URL added to gallery.");
  };

  const removeGalleryPhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Video Stills File Upload (for Videography)
  const onVideoStillsFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingStills(true);
    try {
      const urls = await uploadFilesToCloudinary(files);
      const valid = urls.filter(Boolean);
      if (valid.length > 0) {
        setForm((prev) => ({
          ...prev,
          videoStills: [...(prev.videoStills || []), ...valid],
          gallery: [...(prev.gallery || []), ...valid],
        }));
        toast.push(`${valid.length} video still(s) added.`);
      }
      if (stillsFileInputRef.current) stillsFileInputRef.current.value = "";
    } catch (err) {
      toast.push(err.message || "Failed to upload video stills.", "err");
    } finally {
      setUploadingStills(false);
    }
  };

  const addStillsUrl = () => {
    const clean = stillsUrlInput.trim();
    if (!clean) return;
    setForm((prev) => ({
      ...prev,
      videoStills: [...(prev.videoStills || []), clean],
      gallery: [...(prev.gallery || []), clean],
    }));
    setStillsUrlInput("");
    toast.push("Still URL added.");
  };

  const removeVideoStill = (index) => {
    setForm((prev) => {
      const nextStills = (prev.videoStills || []).filter((_, i) => i !== index);
      return {
        ...prev,
        videoStills: nextStills,
        gallery: nextStills,
      };
    });
  };

  // Video File Upload (Device -> Cloudinary)
  const onVideoDeviceFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploading(true);
    try {
      if (API_CONFIG.USE_API) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiRequest("/upload", {
          method: "POST",
          body: formData,
        });
        const videoUrl = res.url || (res.data && res.data.url);
        setForm((prev) => ({
          ...prev,
          videoUrl,
          videoProvider: "device",
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
        setVideoPreviewUrl(videoUrl);
        setVideoInfo({ name: file.name, size: file.size });
        toast.push(`Video uploaded to Cloudinary: ${file.name}`);
      } else {
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
      }
      if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    } catch (err) {
      toast.push(err.message || "Could not upload video file.", "err");
    } finally {
      setVideoUploading(false);
    }
  };

  // Add New Discipline to MongoDB Atlas
  const handleAddNewDiscipline = async (e) => {
    e.preventDefault();
    const clean = newDisciplineName.trim();
    if (!clean) {
      toast.push("Please enter a discipline name.", "err");
      return;
    }

    // Check duplicate locally first
    const exists = disciplines.some((d) => d.name.toLowerCase() === clean.toLowerCase());
    if (exists) {
      toast.push(`Discipline "${clean}" already exists.`, "err");
      return;
    }

    setAddingDiscipline(true);
    try {
      const created = await disciplineService.create({
        name: clean,
        type: form.type,
      });

      setDisciplines((prev) => [...prev, created]);
      setForm((prev) => ({ ...prev, category: created.name }));
      setNewDisciplineName("");
      setShowAddDiscipline(false);
      toast.push(`Discipline “${created.name}” saved to database.`);
    } catch (err) {
      toast.push(err.message || "Failed to create discipline.", "err");
    } finally {
      setAddingDiscipline(false);
    }
  };

  // Save Project (Draft or Published)
  const handleSave = async (targetStatus) => {
    const statusToApply = targetStatus || form.status || "draft";
    const payload = {
      ...form,
      status: statusToApply,
      placeholder: false,
    };

    if (statusToApply === "draft") {
      const draftErrs = {};
      if (!payload.title.trim()) {
        draftErrs.title = "Project title is required to save a draft.";
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
      } catch (err) {
        toast.push(err.message || "Could not save draft.", "err");
      } finally {
        setProcessing(false);
      }
      return;
    }

    // Full validation for publishing
    const pubErrs = {};
    if (!payload.title.trim()) pubErrs.title = "Project title is required.";
    if (!payload.short.trim()) pubErrs.short = "Short summary / tagline is required.";

    const coverPhoto = payload.cover || payload.thumbnail;
    if (!coverPhoto) {
      pubErrs.cover = isVideo
        ? "A video thumbnail / poster image is required before publishing."
        : "A cover photograph is required before publishing.";
    }

    if (isVideo) {
      if (!payload.videoUrl.trim()) {
        pubErrs.videoUrl = "Please provide a video source or video URL before publishing.";
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
      toast.push(`Project published! It is now live in ${payload.category}.`);
      navigate("/admin/projects?status=published");
    } catch (err) {
      toast.push(err.message || "Could not publish project.", "err");
    } finally {
      setProcessing(false);
    }
  };

  const embedInfo = isVideo
    ? getVideoEmbedInfo(videoPreviewUrl || form.videoUrl, form.videoProvider)
    : null;

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
          Back to Projects
        </Link>
      </div>

      <div className="demo-banner">
        Configure <strong>{isVideo ? "Videography & Film" : "Photography"}</strong> project details.
        All media uploads stream directly to Cloudinary and sync with MongoDB Atlas.
      </div>

      <form className="admin-card form-grid" onSubmit={(e) => e.preventDefault()}>
        {/* SECTION 1: PROJECT BASIC INFORMATION */}
        <p className="kicker">1 — Project Basic Information</p>

        {/* Project Type & Publication Status */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <div className="field" style={{ flex: 1, minWidth: 260 }}>
            <label style={{ display: "block", marginBottom: "0.6rem" }}>
              Project Medium / Type <span className="req">*</span>
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

          <div className="field" style={{ flex: 1, minWidth: 260 }}>
            <label style={{ display: "block", marginBottom: "0.6rem" }}>
              Publication Status <span className="req">*</span>
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
                ? "Draft projects remain private and hidden from the public website."
                : `Published projects are immediately visible across the website.`}
            </span>
          </div>
        </div>

        {/* Title and Slug */}
        <div className="form-row">
          <div className="field">
            <label htmlFor="project-title">
              Project Title <span className="req">*</span>
            </label>
            <input
              id="project-title"
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="e.g. Quiet Light Wedding"
            />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>

          <div className="field">
            <label htmlFor="project-slug">
              Slug (URL path) <span className="req">*</span>
            </label>
            <input
              id="project-slug"
              value={form.slug}
              onChange={(e) => set("slug", projectService.slugify(e.target.value))}
              placeholder="quiet-light-wedding"
            />
          </div>
        </div>

        {/* Tagline and Location */}
        <div className="form-row">
          <div className="field">
            <label htmlFor="project-short">
              Short Editorial Tagline <span className="req">*</span>
            </label>
            <input
              id="project-short"
              value={form.short}
              onChange={(e) => set("short", e.target.value)}
              placeholder="One compelling sentence summarizing the concept"
            />
            {errors.short && <div className="error">{errors.short}</div>}
          </div>

          <div className="field">
            <label htmlFor="project-location">Location / Region</label>
            <input
              id="project-location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Thrissur, Kerala"
            />
          </div>
        </div>

        {/* Shoot Date and Description */}
        <div className="form-row">
          <div className="field">
            <label htmlFor="project-date">Shoot / Production Date</label>
            <input
              id="project-date"
              type="date"
              value={form.shootDate || ""}
              onChange={(e) => set("shootDate", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="project-description">Full Narrative / Description</label>
          <textarea
            id="project-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="Detailed story about lighting, concept, creative direction, and gear..."
          />
        </div>

        {/* SECTION 2: DYNAMIC DISCIPLINE MANAGEMENT */}
        <p className="kicker" style={{ marginTop: "1.4rem" }}>2 — Discipline / Category</p>

        <div className="field">
          <label htmlFor="project-discipline">
            {isVideo ? "Videography Discipline" : "Photography Discipline"} <span className="req">*</span>
          </label>

          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
            <select
              id="project-discipline"
              value={showAddDiscipline ? "__add_new__" : form.category}
              onChange={(e) => {
                if (e.target.value === "__add_new__") {
                  setShowAddDiscipline(true);
                } else {
                  setShowAddDiscipline(false);
                  set("category", e.target.value);
                }
              }}
              style={{ flex: 1, minWidth: 260 }}
            >
              {availableDisciplines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__add_new__">+ Add New Discipline…</option>
            </select>

            {!showAddDiscipline && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAddDiscipline(true)}
                style={{
                  borderColor: "var(--sand)",
                  color: "var(--sand)",
                  padding: "0.55rem 0.9rem",
                  fontSize: "0.78rem",
                  whiteSpace: "nowrap",
                }}
              >
                + Add Discipline
              </button>
            )}
          </div>

          {/* Inline Add New Discipline Input Form */}
          {showAddDiscipline && (
            <div
              style={{
                marginTop: "0.8rem",
                padding: "1rem",
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px dashed var(--dark-border)",
                borderRadius: "4px",
              }}
            >
              <label style={{ fontSize: "0.78rem", color: "var(--sand)", display: "block", marginBottom: "0.4rem" }}>
                Enter New {isVideo ? "Videography" : "Photography"} Discipline Name:
              </label>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="e.g. Architecture Photography or Documentary Films"
                  value={newDisciplineName}
                  onChange={(e) => setNewDisciplineName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewDiscipline(e);
                    }
                  }}
                  style={{ flex: 1, minWidth: 240 }}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-sand"
                  disabled={addingDiscipline}
                  onClick={handleAddNewDiscipline}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.78rem" }}
                >
                  {addingDiscipline ? "Saving…" : "Save Discipline"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowAddDiscipline(false);
                    setNewDisciplineName("");
                  }}
                  style={{ borderColor: "var(--dark-border)", color: "var(--stone)", padding: "0.5rem 0.9rem", fontSize: "0.78rem" }}
                >
                  Cancel
                </button>
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.35rem", display: "block" }}>
                This new discipline will be saved to MongoDB Atlas and remain permanently available in future dropdowns.
              </span>
            </div>
          )}
        </div>

        {/* SECTION 3: COVER / THUMBNAIL (DYNAMIC BY TYPE) */}
        <p className="kicker" style={{ marginTop: "1.4rem" }}>
          3 — {isVideo ? "Video Thumbnail / Poster Image" : "Project Cover Image"}
        </p>

        <div className="field">
          <label>
            {isVideo ? "Video Thumbnail / Poster" : "Cover Photograph"}{" "}
            <span className="req">*</span>
          </label>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.6rem" }}>
            {isVideo
              ? "Primary visual displayed on video cards, the homepage, and before video playback begins."
              : "Primary visual displayed on the portfolio grid, homepage spots, and project header."}
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 280px) 1fr", gap: "1.2rem", alignItems: "start" }}>
            <div
              style={{
                borderRadius: "4px",
                overflow: "hidden",
                border: "1px solid var(--dark-border)",
                background: "var(--dark-red)",
                aspectRatio: isVideo ? "16 / 9" : "4 / 3",
                position: "relative",
              }}
            >
              {form.cover || form.thumbnail ? (
                <img
                  src={form.cover || form.thumbnail}
                  alt="Cover preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--muted)", fontSize: "0.75rem", padding: "1rem", textAlign: "center" }}>
                  {isVideo ? "No Video Thumbnail" : "No Cover Image Selected"}
                </div>
              )}
              {isVideo && (form.cover || form.thumbnail) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    background: "rgba(0, 0, 0, 0.75)",
                    color: "var(--stone)",
                    fontSize: "0.65rem",
                    padding: "2px 6px",
                    borderRadius: 2,
                    letterSpacing: "0.08em",
                  }}
                >
                  VIDEO POSTER
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div className="field">
                <label>Upload from Device {uploadingCover ? "(Uploading to Cloudinary…)" : ""}</label>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/*"
                  disabled={uploadingCover}
                  onChange={onCoverFile}
                />
              </div>

              <div className="field">
                <label>Or Paste Image URL</label>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <input
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyCoverUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={applyCoverUrl}
                    style={{ borderColor: "var(--sand)", color: "var(--sand)", whiteSpace: "nowrap" }}
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>
          </div>
          {errors.cover && <div className="error" style={{ marginTop: "0.5rem" }}>{errors.cover}</div>}
        </div>

        {/* SECTION 4: MAIN VIDEO (SHOWN ONLY FOR VIDEOGRAPHY) */}
        {isVideo && (
          <>
            <p className="kicker" style={{ marginTop: "1.4rem" }}>4 — Main Video</p>

            <div
              style={{
                background: "rgba(0, 70, 67, 0.16)",
                padding: "1.4rem",
                borderRadius: "4px",
                border: "1px solid rgba(168, 230, 207, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontWeight: 600, color: "#a8e6cf", margin: 0, fontSize: "0.95rem" }}>
                  Video Source (Device File or Stream URL) <span className="req">*</span>
                </label>
                {videoInfo.name && (
                  <span style={{ fontSize: "0.72rem", color: "#a8e6cf", opacity: 0.9 }}>
                    Selected: {videoInfo.name} ({formatBytes(videoInfo.size)})
                  </span>
                )}
              </div>

              {/* Device file upload */}
              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
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
                  <span>📁</span> {videoUploading ? "Uploading video to Cloudinary..." : "Choose video from device"}
                </label>
                <input
                  id="device-video-file-input"
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                  onChange={onVideoDeviceFile}
                  disabled={videoUploading}
                  style={{ display: "none" }}
                />
                <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Uploads directly to Cloudinary (MP4, WebM, MOV supported up to 100MB).
                </span>
              </div>

              {/* URL and Provider Inputs */}
              <div className="form-row">
                <div className="field" style={{ flex: 2 }}>
                  <label style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                    Or paste online video URL (YouTube, Vimeo, or Cloudinary MP4)
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
                  <label>Film Duration</label>
                  <input
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="e.g. 03:40 or 1m 30s"
                  />
                </div>
              </div>

              {/* Live Video Preview Box */}
              {form.videoUrl && embedInfo && embedInfo.type !== "none" && (
                <div>
                  <label style={{ fontSize: "0.72rem", color: "var(--stone)", marginBottom: "0.35rem", display: "block" }}>
                    Live Video Playback Preview:
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
                        poster={form.thumbnail || form.cover || "/images/projects/travel-photography/cover.jpg"}
                        src={videoPreviewUrl || form.videoUrl}
                        style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
                      />
                    ) : embedInfo.type === "youtube" || embedInfo.type === "vimeo" ? (
                      <iframe
                        src={embedInfo.embedUrl}
                        title="Video Preview"
                        style={{ width: "100%", height: "100%", border: 0 }}
                        allowFullScreen
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* SECTION 5: GALLERY / STILLS (DYNAMIC BY TYPE) */}
        <p className="kicker" style={{ marginTop: "1.4rem" }}>
          5 — {isVideo ? "Video Stills & Behind the Scenes" : "Gallery Photographs"}
        </p>

        {isVideo ? (
          /* VIDEOGRAPHY STILLS SECTION */
          <div className="field">
            <label>
              Video Stills &amp; Production Captures ({form.videoStills?.length || 0} stills)
            </label>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.6rem" }}>
              Upload production frames and behind-the-scenes photographs for this film. Displayed on the project details page.
            </span>

            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.8rem" }}>
              <input
                ref={stillsFileInputRef}
                type="file"
                accept="image/*"
                multiple
                disabled={uploadingStills}
                onChange={onVideoStillsFiles}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                placeholder="Or paste image URL to add to video stills"
                value={stillsUrlInput}
                onChange={(e) => setStillsUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addStillsUrl();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={addStillsUrl}
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

            {/* Video Stills Thumbnails */}
            {form.videoStills && form.videoStills.length > 0 && (
              <div className="thumbs" style={{ marginTop: "0.8rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {form.videoStills.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      width: 90,
                      height: 65,
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid var(--dark-border)",
                    }}
                  >
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeVideoStill(i)}
                      title="Remove still"
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "rgba(0,0,0,0.8)",
                        color: "#ff8b8b",
                        border: 0,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* PHOTOGRAPHY GALLERY SECTION */
          <div className="field">
            <label>
              Gallery Photographs ({form.gallery?.length || 0} frames)
            </label>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.6rem" }}>
              Upload high-resolution photography frames for this series. Displayed in the portfolio gallery and lightbox.
            </span>

            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.8rem" }}>
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                multiple
                disabled={uploadingGallery}
                onChange={onGalleryFiles}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                placeholder="Or paste photo image URL to add to gallery"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGalleryUrl();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={addGalleryUrl}
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

            {/* Gallery Thumbnails */}
            {form.gallery && form.gallery.length > 0 && (
              <div className="thumbs" style={{ marginTop: "0.8rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {form.gallery.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      width: 90,
                      height: 65,
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid var(--dark-border)",
                    }}
                  >
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeGalleryPhoto(i)}
                      title="Remove from gallery"
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "rgba(0,0,0,0.8)",
                        color: "#ff8b8b",
                        border: 0,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 6: FEATURED TOGGLE */}
        <div style={{ marginTop: "1rem" }}>
          <label style={{ display: "flex", gap: "0.6rem", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            <span>
              Feature on the home page ({isVideo ? "Featured Videography" : "Featured Photography"})
            </span>
          </label>
        </div>

        {/* CLEAR ACTION BUTTONS */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
            paddingTop: "1.4rem",
            marginTop: "0.8rem",
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
