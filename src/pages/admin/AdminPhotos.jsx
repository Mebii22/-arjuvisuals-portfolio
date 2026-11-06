import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { projectService } from "../../services/projectService";
import { API_CONFIG, apiRequest } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { compressImageFile } from "../../utils/imageUtils";
import {
  MAX_IMAGE_SIZE_BYTES,
  validateMediaFile,
  uploadDirectToCloudinary,
} from "../../services/cloudinaryDirectUpload";

export default function AdminPhotos() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(searchParams.get("project") || null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Staged files for adding to gallery
  const [stagedFiles, setStagedFiles] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploadLocation, setUploadLocation] = useState("");
  const [uploading, setUploading] = useState(false);

  // Cover replace input
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  const load = async () => {
    try {
      const data = await projectService.list({ includeDrafts: true });
      setProjects(data);
    } catch (err) {
      toast.push(err.message || "Could not load projects.", "err");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Sync URL query param when active project changes
  const selectProject = (id) => {
    setActiveProjectId(id);
    setStagedFiles([]);
    setUrlInput("");
    setCoverUrlInput("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id) next.set("project", id);
      else next.delete("project");
      return next;
    });
  };

  // Find currently active project
  const activeProject = useMemo(() => {
    if (!activeProjectId) return null;
    return projects.find((p) => p.id === activeProjectId || p._id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  // Filtered projects for the overview list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const pType = p.type || "photography";
      if (typeFilter !== "all" && pType !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${p.title || ""} ${p.category || ""} ${p.location || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [projects, typeFilter, searchQuery]);

  const photoCount = projects.filter((p) => (p.type || "photography") === "photography").length;
  const videoCount = projects.filter((p) => p.type === "videography").length;

  // Cloudinary / Compression File Processor
  const processFiles = async (files) => {
    if (!files.length) return [];
    if (API_CONFIG.USE_API) {
      return await Promise.all(
        files.map(async (file) => {
          try {
            const direct = await uploadDirectToCloudinary(file, { resourceType: "image" });
            return { name: file.name, dataUrl: direct.url };
          } catch {
            const formData = new FormData();
            formData.append("file", file);
            const res = await apiRequest("/upload", {
              method: "POST",
              body: formData,
            });
            const url = res.url || (res.data && res.data.url);
            return { name: file.name, dataUrl: url };
          }
        })
      );
    } else {
      return await Promise.all(
        files.map(async (file) => {
          const dataUrl = await compressImageFile(file, 1600, 1600, 0.82);
          return { name: file.name, dataUrl };
        })
      );
    }
  };

  // Multiple files chosen for gallery addition
  const onFilesChosen = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const f of files) {
      const validation = validateMediaFile(f, "image");
      if (!validation.valid) {
        toast.push(validation.error, "err");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    setUploading(true);
    try {
      const items = await processFiles(files);
      setStagedFiles((prev) => [...prev, ...items]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.push("Could not process selected image file(s).", "err");
    } finally {
      setUploading(false);
    }
  };

  const addUrlToStaged = () => {
    const clean = urlInput.trim();
    if (!clean) return;
    setStagedFiles((prev) => [
      ...prev,
      { name: clean.split("/").pop() || "Image URL", dataUrl: clean },
    ]);
    setUrlInput("");
  };

  const removeStaged = (index) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Add staged files to active project's gallery
  const addPhotosToGallery = async (e) => {
    e.preventDefault();
    if (!activeProject) return;
    if (!stagedFiles.length) {
      toast.push("Please choose at least one image or stage a photo URL.", "err");
      return;
    }

    const newUrls = stagedFiles.map((item) => item.dataUrl);
    const nextLocations = { ...(activeProject.photoLocations || {}) };
    const locText = uploadLocation.trim() || activeProject.location || "Kerala";
    newUrls.forEach((u) => {
      nextLocations[u] = locText;
    });

    try {
      await projectService.update(activeProject.id, {
        gallery: [...(activeProject.gallery || []), ...newUrls],
        photoLocations: nextLocations,
      });
      toast.push(
        `${newUrls.length} photograph(s) added to “${activeProject.title}”.`
      );
      setStagedFiles([]);
      setUploadLocation("");
      await load();
    } catch (err) {
      toast.push(err.message || "Failed to add photos to gallery.", "err");
    }
  };

  // Replace Cover image
  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeProject) return;

    const validation = validateMediaFile(file, "image");
    if (!validation.valid) {
      toast.push(validation.error, "err");
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
      return;
    }

    setUploadingCover(true);
    try {
      const items = await processFiles([file]);
      if (items.length && items[0].dataUrl) {
        await applyNewCover(items[0].dataUrl);
      }
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
    } catch {
      toast.push("Failed to upload new cover photo.", "err");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCoverUrlSubmit = async (e) => {
    e.preventDefault();
    if (!coverUrlInput.trim() || !activeProject) return;
    await applyNewCover(coverUrlInput.trim());
    setCoverUrlInput("");
  };

  const applyNewCover = async (newCoverUrl) => {
    if (!activeProject || !newCoverUrl) return;
    const oldCover = activeProject.cover;
    const nextGallery = [...(activeProject.gallery || [])];

    // If the old cover is not already in the gallery, keep it preserved in gallery
    if (oldCover && !nextGallery.includes(oldCover)) {
      nextGallery.unshift(oldCover);
    }

    try {
      await projectService.update(activeProject.id, {
        cover: newCoverUrl,
        gallery: nextGallery,
      });
      toast.push(`Cover photograph updated for “${activeProject.title}”.`);
      await load();
    } catch (err) {
      toast.push(err.message || "Failed to update cover photo.", "err");
    }
  };

  // Update photo caption / location (after dot ·)
  const updatePhotoLocation = async (src, newLoc, isCover = false) => {
    if (!activeProject) return;
    const trimmed = (newLoc || "").trim();
    const nextLocations = { ...(activeProject.photoLocations || {}) };
    nextLocations[src] = trimmed;

    const nextGallery = (activeProject.gallery || []).map((item) => {
      const itemSrc = typeof item === "string" ? item : (item && (item.image || item.src));
      if (itemSrc === src) {
        if (typeof item === "object") {
          return { ...item, location: trimmed };
        }
        return { image: item, location: trimmed, caption: "" };
      }
      return item;
    });

    const payload = { photoLocations: nextLocations, gallery: nextGallery };
    if (isCover && trimmed) {
      payload.location = trimmed;
    }

    try {
      await projectService.update(activeProject.id, payload);
      toast.push(`Updated caption to: “${activeProject.category.replace(" Photography", "")} · ${trimmed || activeProject.location}”`);
      await load();
    } catch (err) {
      toast.push("Failed to update caption.", "err");
    }
  };

  // Promote a gallery photo to Cover
  const setAsCover = async (photoSrc, galleryIndex) => {
    if (!activeProject) return;
    const oldCover = activeProject.cover;
    const nextGallery = (activeProject.gallery || []).filter((_, idx) => idx !== galleryIndex);
    if (oldCover && !nextGallery.includes(oldCover)) {
      nextGallery.unshift(oldCover);
    }

    try {
      await projectService.update(activeProject.id, {
        cover: photoSrc,
        gallery: nextGallery,
      });
      toast.push(`Updated cover photograph for “${activeProject.title}”.`);
      await load();
    } catch (err) {
      toast.push("Failed to set cover photo.", "err");
    }
  };

  // Remove photo from active project gallery
  const removePhotoFromProject = async (galleryIndex) => {
    if (!activeProject) return;
    const nextGallery = (activeProject.gallery || []).filter((_, idx) => idx !== galleryIndex);
    try {
      await projectService.update(activeProject.id, { gallery: nextGallery });
      toast.push(`Photograph removed from “${activeProject.title}”.`);
      await load();
    } catch (err) {
      toast.push("Failed to remove photograph.", "err");
    }
  };

  return (
    <>
      <SEO title="Project Media & Photos" />

      {/* VIEW A: SINGLE PROJECT FOCUS MODE */}
      {activeProject ? (
        <div>
          <div className="admin-top" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => selectProject(null)}
                style={{ borderColor: "var(--dark-border)", color: "var(--stone)" }}
              >
                ← Back to All Projects
              </button>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.8rem" }}>{activeProject.title}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.3rem" }}>
                  <span className={`pill ${activeProject.type === "videography" ? "video" : "photo"}`}>
                    {activeProject.type === "videography" ? "Videography" : "Photography"}
                  </span>
                  <span className={`pill ${activeProject.status === "published" ? "pub" : "draft"}`}>
                    {activeProject.status === "published" ? "LIVE" : "DRAFT"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    {activeProject.category} · {activeProject.location || "Kerala"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: COVER PHOTO / VIDEO THUMBNAIL */}
          <div className="admin-card form-grid" style={{ marginBottom: "1.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="kicker" style={{ margin: 0 }}>
                {activeProject.type === "videography" ? "Video Thumbnail / Poster Image" : "Cover Photograph"}
              </p>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                {activeProject.type === "videography"
                  ? "Poster image displayed on video cards, the homepage, and before video playback begins"
                  : "Main image displayed on the portfolio grid and project header"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 320px) 1fr", gap: "1.5rem", alignItems: "start" }}>
              <div
                style={{
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid var(--dark-border)",
                  background: "var(--dark-red)",
                  aspectRatio: activeProject.type === "videography" ? "16/9" : "16/10",
                }}
              >
                <img
                  src={
                    activeProject.cover ||
                    activeProject.thumbnail ||
                    (activeProject.type === "videography"
                      ? "/images/projects/travel-photography/cover.jpg"
                      : "/images/projects/wedding-photography/cover.jpg")
                  }
                  alt={activeProject.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = activeProject.type === "videography"
                      ? "/images/projects/travel-photography/cover.jpg"
                      : "/images/projects/wedding-photography/cover.jpg";
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                <div className="field">
                  <label>
                    {activeProject.type === "videography" ? "Thumbnail Caption & Location (Text after dot ·)" : "Cover Caption & Location (Text after dot ·)"}
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span
                      style={{
                        background: "rgba(0, 0, 0, 0.45)",
                        padding: "0.45rem 0.65rem",
                        borderRadius: "3px",
                        fontSize: "0.82rem",
                        color: "var(--soft-white)",
                        border: "1px solid var(--dark-border)",
                        whiteSpace: "nowrap",
                        fontWeight: "600",
                      }}
                    >
                      {activeProject.category.replace(" Photography", "")} ·
                    </span>
                    <input
                      type="text"
                      key={activeProject.location || ""}
                      defaultValue={activeProject.location || ""}
                      placeholder="e.g. Kerala, Thrissur"
                      onBlur={(e) => updatePhotoLocation(activeProject.cover, e.target.value, true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.target.blur();
                        }
                      }}
                      title="Press Enter or click away to save caption."
                      style={{ flex: 1 }}
                    />
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                    Press Enter or click away to save caption changes.
                  </span>
                </div>

                <div className="field">
                  <label>
                    {activeProject.type === "videography" ? "Replace Thumbnail: Upload from device" : "Replace Cover: Upload from device"} {uploadingCover ? "(Processing…)" : ""}
                  </label>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={uploadingCover}
                    onChange={handleCoverFileUpload}
                  />
                </div>

                <div className="field">
                  <label>
                    {activeProject.type === "videography" ? "Or paste new thumbnail URL" : "Or paste new cover image URL"}
                  </label>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <input
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={coverUrlInput}
                      onChange={(e) => setCoverUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleCoverUrlSubmit}
                      style={{ borderColor: "var(--sand)", color: "var(--sand)", whiteSpace: "nowrap" }}
                    >
                      {activeProject.type === "videography" ? "Apply Thumbnail" : "Apply Cover"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ADD PHOTOS / VIDEO STILLS */}
          <form className="admin-card form-grid" onSubmit={addPhotosToGallery} style={{ marginBottom: "1.8rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", fontSize: "1.3rem", margin: 0 }}>
              ADD {activeProject.type === "videography" ? "VIDEO STILLS" : "PHOTOS"} TO {activeProject.title.toUpperCase()}
            </h2>

            <div className="form-row">
              <div className="field">
                <label htmlFor="gallery-file-input">
                  Choose photo file(s) from device {uploading ? "(Uploading…)" : ""}
                </label>
                <input
                  id="gallery-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={onFilesChosen}
                  style={{ marginTop: "0.4rem" }}
                />
              </div>

              <div className="field">
                <label htmlFor="gallery-url-input">Or paste photo image URL</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    id="gallery-url-input"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addUrlToStaged();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={addUrlToStaged}
                    style={{ borderColor: "var(--sand)", color: "var(--sand)", height: "42px" }}
                  >
                    Stage
                  </button>
                </div>
              </div>
            </div>

            <div className="field">
              <label>Caption &amp; Location (Text after dot ·)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span
                  style={{
                    background: "rgba(0, 0, 0, 0.45)",
                    padding: "0.45rem 0.65rem",
                    borderRadius: "3px",
                    fontSize: "0.82rem",
                    color: "var(--soft-white)",
                    border: "1px solid var(--dark-border)",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                  }}
                >
                  {activeProject.category.replace(" Photography", "")} ·
                </span>
                <input
                  type="text"
                  placeholder={`e.g. ${activeProject.location || "Kerala, India"}`}
                  value={uploadLocation}
                  onChange={(e) => setUploadLocation(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            {stagedFiles.length > 0 && (
              <div className="field">
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                  Ready to add ({stagedFiles.length}):
                </label>
                <div className="thumbs" style={{ marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.7rem" }}>
                  {stagedFiles.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: 96,
                        height: 72,
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid var(--dark-border)",
                        background: "var(--dark-red)",
                      }}
                    >
                      <img
                        src={item.dataUrl}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeStaged(idx)}
                        title="Remove from selection"
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          background: "rgba(0, 0, 0, 0.75)",
                          color: "#ff8b8b",
                          border: 0,
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "11px",
                          lineHeight: 1,
                        }}
                      >
                        ✕
                      </button>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0, 0, 0, 0.78)",
                          fontSize: "9px",
                          padding: "2px 4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "var(--sand)",
                        }}
                      >
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
              <button className="btn btn-sand" type="submit" disabled={uploading} style={{ width: "fit-content" }}>
                Add to {activeProject.type === "videography" ? "Video Stills" : "Project Gallery"} {stagedFiles.length > 0 ? `(${stagedFiles.length})` : ""}
              </button>
              {stagedFiles.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStagedFiles([])}
                  style={{ borderColor: "var(--sand)", color: "var(--sand)", padding: "0.55rem 0.9rem" }}
                >
                  Clear selection
                </button>
              )}
            </div>
          </form>

          {/* SECTION 3: PROJECT GALLERY PHOTOS / VIDEO STILLS */}
          <div className="admin-top" style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", fontSize: "1.4rem", margin: 0 }}>
              {activeProject.type === "videography" ? "VIDEO STILLS & PRODUCTION FRAMES" : "GALLERY PHOTOGRAPHS"} ({activeProject.gallery?.length || 0})
            </h2>
          </div>

          {activeProject.gallery && activeProject.gallery.length > 0 ? (
            <div className="photo-admin-grid">
              {activeProject.gallery.map((item, idx) => {
                const src = typeof item === "string" ? item : (item && (item.image || item.src || ""));
                const currentLoc =
                  (typeof item === "object" && item.location)
                    ? item.location
                    : ((activeProject.photoLocations && activeProject.photoLocations[src]) || activeProject.location || "");
                const disciplineName = activeProject.category.replace(" Photography", "");

                return (
                  <figure key={`${activeProject.id}-gallery-${idx}`}>
                    <img src={src} alt="" />
                    <figcaption>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, color: "var(--stone)", fontSize: "0.68rem" }}>
                          Frame #{idx + 1}
                        </span>
                        <div style={{ display: "flex", gap: "0.55rem" }}>
                          <button
                            type="button"
                            onClick={() => setAsCover(src, idx)}
                            title="Make this the project cover"
                            style={{
                              background: "transparent",
                              border: 0,
                              color: "var(--sand)",
                              cursor: "pointer",
                              fontSize: "0.68rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              padding: 0,
                              textDecoration: "underline",
                            }}
                          >
                            Set Cover
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhotoFromProject(idx)}
                            title="Remove photograph from gallery"
                            style={{
                              background: "transparent",
                              border: 0,
                              color: "#e7b3b3",
                              cursor: "pointer",
                              fontSize: "0.68rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              padding: 0,
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: "0.4rem", paddingTop: "0.4rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: "600",
                              color: "var(--soft-white)",
                              background: "rgba(0, 0, 0, 0.45)",
                              padding: "0.22rem 0.45rem",
                              borderRadius: "2px",
                              letterSpacing: "0.04em",
                              whiteSpace: "nowrap",
                              border: "1px solid var(--dark-border)",
                            }}
                          >
                            {disciplineName} ·
                          </span>
                          <input
                            type="text"
                            defaultValue={currentLoc}
                            placeholder="e.g. Kerala, Thrissur"
                            onBlur={(e) => updatePhotoLocation(src, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.target.blur();
                              }
                            }}
                            title="Press Enter or click away to save caption."
                            style={{
                              fontSize: "0.72rem",
                              padding: "0.22rem 0.45rem",
                              background: "rgba(0, 0, 0, 0.3)",
                              border: "1px solid var(--dark-border)",
                              color: "var(--stone)",
                              borderRadius: "2px",
                              flex: 1,
                              minWidth: 0,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: "var(--muted)",
                            marginTop: "0.22rem",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>Text after dot “·”</span>
                          <span>Enter to save</span>
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ) : (
            <div className="admin-card empty-state" style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                No gallery photographs added yet for “{activeProject.title}”.
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "var(--stone)" }}>
                Use the form above to upload images directly from your device or stage image URLs.
              </p>
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => selectProject(null)}
              style={{ borderColor: "var(--dark-border)", color: "var(--stone)" }}
            >
              ← Back to All Projects
            </button>
          </div>
        </div>
      ) : (
        /* VIEW B: ALL PROJECTS GROUPED OVERVIEW MODE */
        <div>
          <div className="admin-top">
            <h1>PROJECT PHOTOS &amp; MEDIA</h1>
          </div>
          <div className="demo-banner">
            Select a project below to manage its cover photograph and gallery images. Changes save directly to
            MongoDB Atlas.
          </div>

          {/* Top Category Tabs */}
          <div style={{ marginBottom: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
            <div className="admin-type-tabs" role="tablist" aria-label="Filter projects by discipline">
              <button
                type="button"
                className={`admin-type-btn ${typeFilter === "all" ? "active" : ""}`}
                onClick={() => setTypeFilter("all")}
              >
                All Projects ({projects.length})
              </button>
              <button
                type="button"
                className={`admin-type-btn ${typeFilter === "photography" ? "active" : ""}`}
                onClick={() => setTypeFilter("photography")}
              >
                📷 Photography ({photoCount})
              </button>
              <button
                type="button"
                className={`admin-type-btn ${typeFilter === "videography" ? "active" : ""}`}
                onClick={() => setTypeFilter("videography")}
              >
                🎬 Videography ({videoCount})
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by title, category, location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "var(--dark-red-elevated)",
                border: "1px solid var(--dark-border)",
                color: "var(--stone)",
                padding: "0.45rem 0.8rem",
                borderRadius: "3px",
                fontSize: "0.85rem",
                minWidth: "240px",
              }}
            />
          </div>

          {/* Projects Grouped Table / Cards */}
          <div className="admin-card" style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Cover</th>
                  <th>Project Name</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Images</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => {
                  const isVideo = p.type === "videography";
                  const isPub = p.status === "published";
                  const galleryCount = (p.gallery || []).length;
                  const totalImages = (p.cover ? 1 : 0) + galleryCount;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div
                          style={{
                            width: 58,
                            height: 44,
                            borderRadius: "3px",
                            overflow: "hidden",
                            background: "var(--dark-red)",
                            border: "1px solid var(--dark-border)",
                          }}
                        >
                          {p.cover || p.thumbnail ? (
                            <img
                              src={p.cover || p.thumbnail}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = isVideo
                                  ? "/images/projects/travel-photography/cover.jpg"
                                  : "/images/projects/wedding-photography/cover.jpg";
                              }}
                            />
                          ) : (
                            <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: "0.6rem", color: "var(--muted)" }}>
                              No Image
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: "var(--stone)", fontSize: "0.92rem", display: "block" }}>
                          {p.title}
                        </strong>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                          {p.location || "Kerala, India"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.85rem", color: "var(--soft-white)" }}>
                          {p.category}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${isVideo ? "video" : "photo"}`}>
                          {isVideo ? "Videography" : "Photography"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.85rem", color: "var(--stone)", fontWeight: 500 }}>
                          {totalImages} {totalImages === 1 ? "image" : "images"}
                        </span>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "var(--muted)" }}>
                          1 Cover · {galleryCount} Gallery
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${isPub ? "pub" : "draft"}`}>
                          {isPub ? "LIVE" : "DRAFT"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-sand"
                          onClick={() => selectProject(p.id)}
                          style={{
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.72rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          Manage Photos →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!filteredProjects.length && (
              <p className="empty-state" style={{ margin: "2rem 0", textAlign: "center" }}>
                No projects match the selected filter.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
