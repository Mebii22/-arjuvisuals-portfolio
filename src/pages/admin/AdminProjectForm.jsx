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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB limit

const normalizeMediaItem = (item, defaultLoc = "") => {
  if (!item) return null;
  if (typeof item === "string") {
    return { image: item, location: defaultLoc || "", caption: "" };
  }
  return {
    image: item.image || item.src || item.url || "",
    location: item.location !== undefined ? item.location : (defaultLoc || ""),
    caption: item.caption || item.alt || "",
  };
};

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
            const normGallery = (p.gallery || [])
              .map((item) => normalizeMediaItem(item, p.location || ""))
              .filter(Boolean);
            const normStills = (p.videoStills || [])
              .map((item) => normalizeMediaItem(item, p.location || ""))
              .filter(Boolean);

            setForm({
              ...blank,
              ...p,
              type: projectType,
              category: p.category || (projectType === "videography" ? "Cinematic Films" : "Wedding Photography"),
              cover: coverImg,
              thumbnail: p.thumbnail || coverImg,
              gallery: normGallery,
              videoStills: normStills.length > 0 ? normStills : normGallery,
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
      const nextCategory =
        typeDisciplines[0] || (newType === "videography" ? "Cinematic Films" : "Wedding Photography");
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
      return await Promise.all(list.map((file) => compressImageFile(file, 1600, 1600, 0.85)));
    }
  };

  // Cover / Thumbnail File Upload
  const onCoverFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      toast.push(`This file is too large (${mb} MB). Please upload a file smaller than 10 MB.`, "err");
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
      return;
    }

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

    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      const maxOversized = oversized.reduce((max, f) => (f.size > max.size ? f : max), oversized[0]);
      const mb = (maxOversized.size / (1024 * 1024)).toFixed(1);
      toast.push(`This file is too large (${mb} MB). Please upload a file smaller than 10 MB.`, "err");
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
      return;
    }

    setUploadingGallery(true);
    try {
      const urls = await uploadFilesToCloudinary(files);
      const valid = urls.filter(Boolean);
      if (valid.length > 0) {
        const newItems = valid.map((url) => ({
          image: url,
          location: form.location || "",
          caption: "",
        }));
        setForm((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...newItems],
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
      gallery: [...prev.gallery, { image: clean, location: prev.location || "", caption: "" }],
    }));
    setGalleryUrlInput("");
    toast.push("Photo URL added to gallery.");
  };

  const updateGalleryPhoto = (index, field, value) => {
    setForm((prev) => {
      const nextGallery = [...prev.gallery];
      if (nextGallery[index]) {
        nextGallery[index] = { ...nextGallery[index], [field]: value };
      }
      return { ...prev, gallery: nextGallery };
    });
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

    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      const maxOversized = oversized.reduce((max, f) => (f.size > max.size ? f : max), oversized[0]);
      const mb = (maxOversized.size / (1024 * 1024)).toFixed(1);
      toast.push(`This file is too large (${mb} MB). Please upload a file smaller than 10 MB.`, "err");
      if (stillsFileInputRef.current) stillsFileInputRef.current.value = "";
      return;
    }

    setUploadingStills(true);
    try {
      const urls = await uploadFilesToCloudinary(files);
      const valid = urls.filter(Boolean);
      if (valid.length > 0) {
        const newItems = valid.map((url) => ({
          image: url,
          location: form.location || "",
          caption: "",
        }));
        setForm((prev) => ({
          ...prev,
          videoStills: [...(prev.videoStills || []), ...newItems],
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
      videoStills: [...(prev.videoStills || []), { image: clean, location: prev.location || "", caption: "" }],
    }));
    setStillsUrlInput("");
    toast.push("Still URL added.");
  };

  const updateVideoStill = (index, field, value) => {
    setForm((prev) => {
      const nextStills = [...(prev.videoStills || [])];
      if (nextStills[index]) {
        nextStills[index] = { ...nextStills[index], [field]: value };
      }
      return { ...prev, videoStills: nextStills };
    });
  };

  const removeVideoStill = (index) => {
    setForm((prev) => ({
      ...prev,
      videoStills: (prev.videoStills || []).filter((_, i) => i !== index),
    }));
  };

  // Video File Upload (Device -> Cloudinary)
  const onVideoDeviceFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      toast.push(`This file is too large (${mb} MB). Please upload a file smaller than 10 MB.`, "err");
      if (videoFileInputRef.current) videoFileInputRef.current.value = "";
      return;
    }

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

    const exists = disciplines.some((d) => d.name.toLowerCase() === clean.toLowerCase());
    if (exists) {
      toast.push(`Discipline “${clean}” already exists.`, "err");
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
        {/* ==========================================
            SECTION 1: BASIC PROJECT INFORMATION
        =========================================== */}
        <p className="kicker">SECTION 1 — Basic Project Information</p>

        {/* Project Medium / Type */}
        <div className="field" style={{ marginBottom: "0.5rem" }}>
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
          <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.35rem", display: "block" }}>
            {isVideo
              ? "Videography projects stream video and feature production stills."
              : "Photography projects feature high-resolution gallery frames."}
          </span>
        </div>

        {/* Title and Slug */}
        <div className="form-row">
          <div className="field" style={{ flex: 2 }}>
            <label htmlFor="project-title">
              Project Title <span className="req">*</span>
            </label>
            <input
              id="project-title"
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder={isVideo ? "e.g. Western Ghats Monsoon" : "e.g. Wedding Photography"}
            />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>

          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="project-slug">URL Slug</label>
            <input
              id="project-slug"
              value={form.slug}
              onChange={(e) => set("slug", projectService.slugify(e.target.value))}
              placeholder="e.g. western-ghats-monsoon"
            />
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem", display: "block" }}>
              Public link: /portfolio/{form.slug || "..."}
            </span>
          </div>
        </div>

        {/* Category / Discipline Selector */}
        <div className="field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <label htmlFor="project-category" style={{ margin: 0 }}>
              Discipline / Category <span className="req">*</span>
            </label>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowAddDiscipline(!showAddDiscipline)}
              style={{
                fontSize: "0.72rem",
                padding: "0.25rem 0.6rem",
                borderColor: "rgba(168, 230, 207, 0.4)",
                color: "#a8e6cf",
              }}
            >
              {showAddDiscipline ? "✕ Close" : "➕ Add New Discipline"}
            </button>
          </div>

          <select
            id="project-category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {availableDisciplines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Inline Add Discipline Panel */}
          {showAddDiscipline && (
            <div
              style={{
                marginTop: "0.6rem",
                padding: "0.9rem",
                background: "rgba(0, 70, 67, 0.15)",
                border: "1px dashed rgba(168, 230, 207, 0.4)",
                borderRadius: 4,
              }}
            >
              <label style={{ fontSize: "0.75rem", color: "#a8e6cf", display: "block", marginBottom: "0.4rem" }}>
                Create New {isVideo ? "Videography" : "Photography"} Discipline in MongoDB:
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder={isVideo ? "e.g. Documentary Films" : "e.g. Architecture Photography"}
                  value={newDisciplineName}
                  onChange={(e) => setNewDisciplineName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-sand"
                  onClick={handleAddNewDiscipline}
                  disabled={addingDiscipline}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.78rem", whiteSpace: "nowrap" }}
                >
                  {addingDiscipline ? "Saving..." : "Save Discipline"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Short Tagline / Summary */}
        <div className="field">
          <label htmlFor="project-short">
            Tagline / Short Summary <span className="req">*</span>
          </label>
          <input
            id="project-short"
            value={form.short}
            onChange={(e) => set("short", e.target.value)}
            placeholder={
              isVideo
                ? "e.g. A visual study of monsoon mist, canopy, and rain shadows across Kerala."
                : "e.g. Wedding frames that stay with the glance, not the checklist."
            }
          />
          {errors.short && <div className="error">{errors.short}</div>}
        </div>

        {/* Full Story Description */}
        <div className="field">
          <label htmlFor="project-description">
            Project Description &amp; Creative Notes
          </label>
          <textarea
            id="project-description"
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Detailed creative story, technical notes, equipment, or lighting approach..."
          />
        </div>

        {/* Shoot Location & Date */}
        <div className="form-row">
          <div className="field">
            <label htmlFor="project-location">Primary Project Location</label>
            <input
              id="project-location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Kochi, Kerala or Western Ghats"
            />
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem", display: "block" }}>
              Default location for this project. Individual frames below can specify their own specific locations.
            </span>
          </div>

          <div className="field">
            <label htmlFor="project-date">Shoot Date / Release Timeline</label>
            <input
              id="project-date"
              type="date"
              value={form.shootDate ? form.shootDate.slice(0, 10) : ""}
              onChange={(e) => set("shootDate", e.target.value)}
            />
          </div>
        </div>

        {/* ========================================================
            SECTION 2: MEDIA BY TYPE (PHOTOGRAPHY vs VIDEOGRAPHY)
        ========================================================= */}
        {!isVideo ? (
          /* ========================================================
             PHOTOGRAPHY MEDIA (All video fields completely hidden)
          ========================================================= */
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--dark-border)", paddingTop: "1.2rem" }}>
            <p className="kicker">SECTION 2 — Photography Media</p>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: "1.2rem" }}>
              Upload the series cover photograph and gallery frames. All video fields are hidden because this is a photography project.
            </span>

            {/* 1. Cover Photograph */}
            <div className="field" style={{ marginBottom: "1.6rem" }}>
              <label>
                Cover Photograph <span className="req">*</span>
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "1.2rem",
                  alignItems: "center",
                  background: "rgba(0,0,0,0.2)",
                  padding: "1rem",
                  borderRadius: 4,
                  border: "1px solid var(--dark-border)",
                }}
              >
                <div
                  style={{
                    width: 140,
                    aspectRatio: "4 / 3",
                    background: "#0c0203",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid var(--dark-border)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {form.cover ? (
                    <img src={form.cover} alt="Cover Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>No cover yet</span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
                    <label
                      htmlFor="cover-file-input"
                      className="btn btn-outline"
                      style={{
                        borderColor: "var(--sand)",
                        color: "var(--sand)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.5rem 0.9rem",
                        fontSize: "0.78rem",
                      }}
                    >
                      📁 {uploadingCover ? "Uploading to Cloudinary..." : "Upload cover photograph"}
                    </label>
                    <input
                      id="cover-file-input"
                      ref={coverFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onCoverFile}
                      disabled={uploadingCover}
                      style={{ display: "none" }}
                    />
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      Recommended: high-resolution landscape (16:9 or 3:2).
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="url"
                      placeholder="Or paste cover image URL"
                      value={coverUrlInput}
                      onChange={(e) => setCoverUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyCoverUrl();
                        }
                      }}
                      style={{ fontSize: "0.82rem" }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={applyCoverUrl}
                      style={{ borderColor: "var(--sand)", color: "var(--sand)", whiteSpace: "nowrap", padding: "0.45rem 0.8rem" }}
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              </div>
              {errors.cover && <div className="error" style={{ marginTop: "0.4rem" }}>{errors.cover}</div>}
            </div>

            {/* 2. Gallery Photographs with Per-Photo Location & Caption */}
            <div className="field">
              <label>
                Gallery Photographs ({form.gallery?.length || 0} frames)
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.8rem" }}>
                Each photograph has its own independent location and caption. Editing one photo will never affect other photos.
              </span>

              {/* Upload & URL Buttons */}
              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
                <label
                  htmlFor="gallery-file-input"
                  className="btn btn-outline"
                  style={{
                    borderColor: "var(--sand)",
                    color: "var(--sand)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 1rem",
                    fontSize: "0.78rem",
                  }}
                >
                  📁 {uploadingGallery ? "Uploading frames to Cloudinary..." : "Upload photographs (batch)"}
                </label>
                <input
                  id="gallery-file-input"
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingGallery}
                  onChange={onGalleryFiles}
                  style={{ display: "none" }}
                />

                <div style={{ display: "flex", gap: "0.4rem", flex: 1, minWidth: 260 }}>
                  <input
                    placeholder="Or paste photo image URL"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addGalleryUrl();
                      }
                    }}
                    style={{ fontSize: "0.82rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={addGalleryUrl}
                    style={{ borderColor: "var(--sand)", color: "var(--sand)", whiteSpace: "nowrap", padding: "0.45rem 0.8rem" }}
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Per-Photo Cards Grid */}
              {form.gallery && form.gallery.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {form.gallery.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "110px 1fr",
                        gap: "1rem",
                        background: "rgba(0, 0, 0, 0.25)",
                        border: "1px solid var(--dark-border)",
                        borderRadius: 4,
                        padding: "0.85rem",
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: 110,
                          aspectRatio: "4 / 3",
                          borderRadius: 3,
                          overflow: "hidden",
                          border: "1px solid var(--dark-border)",
                        }}
                      >
                        <img
                          src={item.image}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            bottom: 2,
                            left: 2,
                            background: "rgba(0,0,0,0.75)",
                            fontSize: "10px",
                            padding: "1px 5px",
                            borderRadius: 2,
                            color: "var(--sand)",
                          }}
                        >
                          #{i + 1}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: 160 }}>
                            <label style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.2rem", display: "block" }}>
                              Location for this frame
                            </label>
                            <input
                              type="text"
                              value={item.location || ""}
                              onChange={(e) => updateGalleryPhoto(i, "location", e.target.value)}
                              placeholder="e.g. Kochi, Kerala"
                              style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem" }}
                            />
                          </div>

                          <div style={{ flex: 1.5, minWidth: 200 }}>
                            <label style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.2rem", display: "block" }}>
                              Caption / note
                            </label>
                            <input
                              type="text"
                              value={item.caption || ""}
                              onChange={(e) => updateGalleryPhoto(i, "caption", e.target.value)}
                              placeholder="e.g. Sunset silhouette on the backwaters"
                              style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem" }}
                            />
                          </div>

                          <button
                            type="button"
                            className="danger"
                            onClick={() => removeGalleryPhoto(i)}
                            title="Remove photo"
                            style={{
                              marginTop: "1.1rem",
                              padding: "0.45rem 0.75rem",
                              fontSize: "0.74rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "1.2rem", border: "1px dashed var(--dark-border)", textAlign: "center", borderRadius: 4 }}>
                  <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: 0 }}>
                    No gallery frames added yet. Click “Upload photographs” or paste a URL above.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================
             VIDEOGRAPHY MEDIA (Photo gallery completely hidden)
          ========================================================= */
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--dark-border)", paddingTop: "1.2rem" }}>
            <p className="kicker">SECTION 2 — Videography Media &amp; Film Stream</p>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: "1.2rem" }}>
              Configure video streaming source, poster thumbnail, duration, and production stills. Photography gallery fields are hidden for videography projects.
            </span>

            {/* 1. Main Video Source & Stream */}
            <div
              style={{
                background: "rgba(0, 70, 67, 0.16)",
                padding: "1.4rem",
                borderRadius: "4px",
                border: "1px solid rgba(168, 230, 207, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
                marginBottom: "1.6rem",
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

              {/* URL, Provider, and Duration */}
              <div className="form-row">
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

            {/* 2. Video Poster / Thumbnail */}
            <div className="field" style={{ marginBottom: "1.6rem" }}>
              <label>
                Video Poster / Thumbnail Image <span className="req">*</span>
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "1.2rem",
                  alignItems: "center",
                  background: "rgba(0,0,0,0.2)",
                  padding: "1rem",
                  borderRadius: 4,
                  border: "1px solid var(--dark-border)",
                }}
              >
                <div
                  style={{
                    width: 140,
                    aspectRatio: "16 / 9",
                    background: "#0c0203",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid var(--dark-border)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {form.cover || form.thumbnail ? (
                    <img src={form.cover || form.thumbnail} alt="Poster Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>No poster yet</span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
                    <label
                      htmlFor="cover-file-input"
                      className="btn btn-outline"
                      style={{
                        borderColor: "var(--sand)",
                        color: "var(--sand)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.5rem 0.9rem",
                        fontSize: "0.78rem",
                      }}
                    >
                      📁 {uploadingCover ? "Uploading to Cloudinary..." : "Upload poster image"}
                    </label>
                    <input
                      id="cover-file-input"
                      ref={coverFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onCoverFile}
                      disabled={uploadingCover}
                      style={{ display: "none" }}
                    />
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      Shown on video player and project cards before video starts.
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="url"
                      placeholder="Or paste poster image URL"
                      value={coverUrlInput}
                      onChange={(e) => setCoverUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyCoverUrl();
                        }
                      }}
                      style={{ fontSize: "0.82rem" }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={applyCoverUrl}
                      style={{ borderColor: "var(--sand)", color: "var(--sand)", whiteSpace: "nowrap", padding: "0.45rem 0.8rem" }}
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              </div>
              {errors.cover && <div className="error" style={{ marginTop: "0.4rem" }}>{errors.cover}</div>}
            </div>

            {/* 3. Video Stills & Behind the Scenes */}
            <div className="field">
              <label>
                Video Stills &amp; Behind the Scenes ({form.videoStills?.length || 0} stills)
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.8rem" }}>
                Production frames and behind-the-scenes photographs for this film. Each still has its own independent location and caption.
              </span>

              {/* Upload & URL Controls */}
              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
                <label
                  htmlFor="stills-file-input"
                  className="btn btn-outline"
                  style={{
                    borderColor: "var(--sand)",
                    color: "var(--sand)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 1rem",
                    fontSize: "0.78rem",
                  }}
                >
                  📁 {uploadingStills ? "Uploading stills to Cloudinary..." : "Upload stills (batch)"}
                </label>
                <input
                  id="stills-file-input"
                  ref={stillsFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingStills}
                  onChange={onVideoStillsFiles}
                  style={{ display: "none" }}
                />

                <div style={{ display: "flex", gap: "0.4rem", flex: 1, minWidth: 260 }}>
                  <input
                    placeholder="Or paste video still URL"
                    value={stillsUrlInput}
                    onChange={(e) => setStillsUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addStillsUrl();
                      }
                    }}
                    style={{ fontSize: "0.82rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={addStillsUrl}
                    style={{ borderColor: "var(--sand)", color: "var(--sand)", whiteSpace: "nowrap", padding: "0.45rem 0.8rem" }}
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Per-Still Cards */}
              {form.videoStills && form.videoStills.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {form.videoStills.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "110px 1fr",
                        gap: "1rem",
                        background: "rgba(0, 0, 0, 0.25)",
                        border: "1px solid var(--dark-border)",
                        borderRadius: 4,
                        padding: "0.85rem",
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: 110,
                          aspectRatio: "16 / 9",
                          borderRadius: 3,
                          overflow: "hidden",
                          border: "1px solid var(--dark-border)",
                        }}
                      >
                        <img
                          src={item.image}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            bottom: 2,
                            left: 2,
                            background: "rgba(0,0,0,0.75)",
                            fontSize: "10px",
                            padding: "1px 5px",
                            borderRadius: 2,
                            color: "var(--sand)",
                          }}
                        >
                          #{i + 1}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: 160 }}>
                            <label style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.2rem", display: "block" }}>
                              Location for this still
                            </label>
                            <input
                              type="text"
                              value={item.location || ""}
                              onChange={(e) => updateVideoStill(i, "location", e.target.value)}
                              placeholder="e.g. Western Ghats, Kerala"
                              style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem" }}
                            />
                          </div>

                          <div style={{ flex: 1.5, minWidth: 200 }}>
                            <label style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.2rem", display: "block" }}>
                              Caption / note
                            </label>
                            <input
                              type="text"
                              value={item.caption || ""}
                              onChange={(e) => updateVideoStill(i, "caption", e.target.value)}
                              placeholder="e.g. Behind the scenes gimbal setup"
                              style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem" }}
                            />
                          </div>

                          <button
                            type="button"
                            className="danger"
                            onClick={() => removeVideoStill(i)}
                            title="Remove still"
                            style={{
                              marginTop: "1.1rem",
                              padding: "0.45rem 0.75rem",
                              fontSize: "0.74rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "1.2rem", border: "1px dashed var(--dark-border)", textAlign: "center", borderRadius: 4 }}>
                  <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: 0 }}>
                    No video stills added yet. Click “Upload stills” or paste a URL above.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            SECTION 3 — PUBLISHING SETTINGS
        ========================================================= */}
        <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--dark-border)", paddingTop: "1.2rem" }}>
          <p className="kicker">SECTION 3 — Publishing Settings</p>
          <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: "1.2rem" }}>
            Control publication visibility and homepage prominence. Draft projects remain private and hidden from public filters.
          </span>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "1.2rem" }}>
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
                  ? "Draft projects remain private and hidden from public filters and search."
                  : "Published projects immediately appear in public filters and galleries."}
              </span>
            </div>

            <div className="field" style={{ flex: 1, minWidth: 260, paddingTop: "1.8rem" }}>
              <label style={{ display: "flex", gap: "0.6rem", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                <span style={{ fontSize: "0.88rem" }}>
                  Feature this project on the Home page highlight reel ({isVideo ? "Featured Film" : "Featured Photography"})
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
              paddingTop: "1.2rem",
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
        </div>
      </form>
    </>
  );
}
