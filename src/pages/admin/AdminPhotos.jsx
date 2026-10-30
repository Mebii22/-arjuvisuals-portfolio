import { useEffect, useMemo, useRef, useState } from "react";
import SEO from "../../components/SEO";
import { projectService } from "../../services/projectService";
import { ALL_CATEGORIES, PHOTOGRAPHY_CATEGORIES, VIDEOGRAPHY_CATEGORIES } from "../../data/projects";
import { normCategory } from "../../utils/projectFilters";
import { useToast } from "../../context/ToastContext";
import { compressImageFile } from "../../utils/imageUtils";

export default function AdminPhotos() {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [stagedFiles, setStagedFiles] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [uploading, setUploading] = useState(false);

  const load = () => projectService.list({ includeDrafts: true }).then(setProjects);
  useEffect(() => {
    load();
  }, []);

  const availableCategories = useMemo(() => {
    const list =
      typeFilter === "photography"
        ? [...PHOTOGRAPHY_CATEGORIES]
        : typeFilter === "videography"
        ? [...VIDEOGRAPHY_CATEGORIES]
        : [...ALL_CATEGORIES];

    // Add any custom categories from user-created projects
    projects.forEach((p) => {
      if (
        p.category &&
        (typeFilter === "all" || (p.type || "photography") === typeFilter) &&
        !list.some((c) => normCategory(c) === normCategory(p.category))
      ) {
        list.push(p.category);
      }
    });
    return list;
  }, [typeFilter, projects]);

  const filteredProjectsForSelect = useMemo(() => {
    return projects.filter((p) => {
      const pType = p.type || "photography";
      if (typeFilter !== "all" && pType !== typeFilter) return false;
      if (filterCategory !== "all" && normCategory(p.category) !== normCategory(filterCategory)) return false;
      return true;
    });
  }, [projects, typeFilter, filterCategory]);

  const photos = useMemo(() => {
    const rows = [];
    projects.forEach((p) => {
      const pType = p.type || "photography";
      if (typeFilter !== "all" && pType !== typeFilter) return;
      if (filterCategory !== "all" && normCategory(p.category) !== normCategory(filterCategory)) return;
      if (filterProject !== "all" && p.id !== filterProject) return;

      if (p.cover) {
        rows.push({
          src: p.cover,
          project: p,
          kind: "cover",
          galleryIndex: -1,
        });
      }
      (p.gallery || []).forEach((src, idx) => {
        if (!src) return;
        rows.push({
          src,
          project: p,
          kind: "gallery",
          galleryIndex: idx,
        });
      });
    });
    return rows;
  }, [projects, typeFilter, filterCategory, filterProject]);

  const onFilesChosen = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const items = await Promise.all(
        files.map(async (file) => {
          const dataUrl = await compressImageFile(file, 1600, 1600, 0.82);
          return { name: file.name, size: file.size, dataUrl };
        })
      );
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

  const [uploadLocation, setUploadLocation] = useState("");
  const selectedProject = projects.find((p) => p.id === projectId);

  const add = async (e) => {
    e.preventDefault();
    if (!projectId) {
      toast.push("Please select a target project.", "err");
      return;
    }
    if (!stagedFiles.length) {
      toast.push("Please choose at least one image file or add a photo URL.", "err");
      return;
    }
    const p = projects.find((x) => x.id === projectId);
    if (!p) return;

    const newUrls = stagedFiles.map((item) => item.dataUrl);
    const nextLocations = { ...(p.photoLocations || {}) };
    const locText = uploadLocation.trim() || p.location || "Kerala";
    newUrls.forEach((u) => {
      nextLocations[u] = locText;
    });

    await projectService.update(p.id, {
      gallery: [...(p.gallery || []), ...newUrls],
      photoLocations: nextLocations,
    });
    toast.push(
      `${newUrls.length} photograph(s) added with caption: “${p.category.replace(" Photography", "")} · ${locText}”.`
    );
    setStagedFiles([]);
    setUploadLocation("");
    load();
  };

  const updatePhotoLocation = async (ph, newLoc) => {
    const p = ph.project;
    const trimmed = (newLoc || "").trim();
    const nextLocations = { ...(p.photoLocations || {}) };
    nextLocations[ph.src] = trimmed;

    const payload = { photoLocations: nextLocations };
    if (ph.kind === "cover" && trimmed) {
      payload.location = trimmed;
    }

    await projectService.update(p.id, payload);
    toast.push(`Updated caption to: “${p.category.replace(" Photography", "")} · ${trimmed || p.location}”`);
    load();
  };

  const setAsCover = async (ph) => {
    const p = ph.project;
    const oldCover = p.cover;
    // Replace cover and swap old cover into gallery
    const nextGallery = (p.gallery || []).filter((_, idx) => idx !== ph.galleryIndex);
    if (oldCover && !nextGallery.includes(oldCover)) {
      nextGallery.unshift(oldCover);
    }
    await projectService.update(p.id, { cover: ph.src, gallery: nextGallery });
    toast.push(`Updated cover photograph for “${p.title}”.`);
    load();
  };

  const removePhotoFromProject = async (ph) => {
    if (ph.kind === "cover") {
      toast.push("To change the cover photograph, use 'Set Cover' on any gallery photo or edit the project.", "err");
      return;
    }
    const p = ph.project;
    const nextGallery = (p.gallery || []).filter((_, idx) => idx !== ph.galleryIndex);
    await projectService.update(p.id, { gallery: nextGallery });
    toast.push(`Photograph removed from “${p.title}”.`);
    load();
  };

  return (
    <>
      <SEO title="Photographs" />
      <div className="admin-top">
        <h1>PHOTOGRAPHS</h1>
      </div>
      <div className="demo-banner">
        Add, manage, and delete photographs across all <strong>7 photography disciplines</strong>. Client-side
        compression prevents storage quota errors.
      </div>

      <form className="admin-card form-grid" onSubmit={add}>
        <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", fontSize: "1.4rem", margin: 0 }}>
          ADD PHOTOGRAPHS TO PROJECT
        </h2>
        <div className="form-row">
          <div className="field">
            <label htmlFor="project-select">
              Target Project <span className="req">*</span>
            </label>
            <select
              id="project-select"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select target project…</option>
              {projects.map((p) => {
                const isVideo = p.type === "videography";
                return (
                  <option key={p.id} value={p.id}>
                    [{isVideo ? "VIDEO STILLS" : "PHOTO"}] {p.title} ({p.category})
                  </option>
                );
              })}
            </select>
          </div>
          <div className="field">
            <label htmlFor="photo-file-input">
              Choose file(s) from device {uploading ? "(Processing…)" : ""}
            </label>
            <input
              id="photo-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={onFilesChosen}
              style={{ marginTop: "0.4rem" }}
            />
          </div>
        </div>

        <div className="form-row" style={{ alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="photo-url-input">Or paste photo image URL</label>
            <input
              id="photo-url-input"
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
          </div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={addUrlToStaged}
            style={{ borderColor: "var(--sand)", color: "var(--sand)", height: "42px" }}
          >
            Stage URL
          </button>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="upload-location-input">
              Text after dot · (Location / Tag)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "3px",
                  fontSize: "0.82rem",
                  color: "var(--soft-white)",
                  border: "1px solid var(--dark-border)",
                  whiteSpace: "nowrap",
                  fontWeight: "600",
                }}
              >
                {selectedProject ? selectedProject.category.replace(" Photography", "") : "Discipline"} ·
              </span>
              <input
                id="upload-location-input"
                type="text"
                placeholder={
                  selectedProject
                    ? `e.g. ${selectedProject.location || "Thrissur, Kerala"}`
                    : "e.g. Kerala, Thrissur"
                }
                value={uploadLocation}
                onChange={(e) => setUploadLocation(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.25rem", display: "block" }}>
              The discipline name ({selectedProject ? selectedProject.category.replace(" Photography", "") : "Wedding, Fashion, etc."}) remains constant. The text you enter here appears after the dot (e.g. Wedding · {uploadLocation || "Kerala"}).
            </span>
          </div>
        </div>

        {stagedFiles.length > 0 && (
          <div className="field" style={{ marginTop: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
              Selected files ready to add ({stagedFiles.length}):
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

        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginTop: "0.4rem" }}>
          <button className="btn btn-sand" type="submit" style={{ width: "fit-content" }} disabled={uploading}>
            Add to gallery {stagedFiles.length > 0 ? `(${stagedFiles.length})` : ""}
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

      <div style={{ marginTop: "2rem", marginBottom: "0.8rem" }}>
        <div className="admin-type-tabs" role="tablist" aria-label="Filter photographs by discipline">
          <button
            type="button"
            className={`admin-type-btn ${typeFilter === "all" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("all");
              setFilterCategory("all");
              setFilterProject("all");
            }}
          >
            All Disciplines
          </button>
          <button
            type="button"
            className={`admin-type-btn ${typeFilter === "photography" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("photography");
              setFilterCategory("all");
              setFilterProject("all");
            }}
          >
            📷 Photography
          </button>
          <button
            type="button"
            className={`admin-type-btn ${typeFilter === "videography" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("videography");
              setFilterCategory("all");
              setFilterProject("all");
            }}
          >
            🎬 Videography (BTS & Stills)
          </button>
        </div>
      </div>

      <div className="admin-top" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", fontSize: "1.8rem", margin: 0 }}>
          PROJECT PHOTOGRAPHS ({photos.length})
        </h2>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterProject("all");
            }}
            style={{
              background: "var(--dark-red-elevated)",
              color: "var(--stone)",
              border: "1px solid var(--dark-border)",
              padding: "0.45rem 0.7rem",
              fontSize: "0.85rem",
            }}
          >
            <option value="all">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c.replace(/ Photography$/i, "")}
              </option>
            ))}
          </select>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            style={{
              background: "var(--dark-red-elevated)",
              color: "var(--stone)",
              border: "1px solid var(--dark-border)",
              padding: "0.45rem 0.7rem",
              fontSize: "0.85rem",
            }}
          >
            <option value="all">All projects</option>
            {filteredProjectsForSelect.map((p) => {
              const isVideo = p.type === "videography";
              const isPub = p.status === "published";
              return (
                <option key={p.id} value={p.id}>
                  [{isVideo ? "VIDEO" : "PHOTO"} · {isPub ? "LIVE" : "DRAFT"}] {p.title}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="photo-admin-grid">
        {photos.map((ph, i) => {
          const currentLoc =
            (ph.project.photoLocations && ph.project.photoLocations[ph.src]) ||
            ph.project.location ||
            "";
          const disciplineName = ph.project.category.replace(" Photography", "");
          const isPub = ph.project.status === "published";

          return (
            <figure key={`${ph.project.id}-${ph.kind}-${ph.galleryIndex}-${i}`}>
              <img src={ph.src} alt="" />
              <figcaption>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "var(--stone)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {ph.kind === "cover" ? "Cover Photo" : "Gallery Frame"}
                    <span className={`pill ${isPub ? "pub" : "draft"}`} style={{ fontSize: "0.58rem", padding: "1px 4px" }}>
                      {isPub ? "LIVE" : "DRAFT"}
                    </span>
                  </span>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    {ph.kind === "gallery" && (
                      <button
                        type="button"
                        onClick={() => setAsCover(ph)}
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
                    )}
                    {ph.kind === "gallery" && (
                      <button
                        type="button"
                        onClick={() => removePhotoFromProject(ph)}
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
                    )}
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
                      title="Discipline type (constant)"
                    >
                      {disciplineName} ·
                    </span>
                    <input
                      type="text"
                      key={currentLoc}
                      defaultValue={currentLoc}
                      placeholder="e.g. Kerala, Thrissur"
                      onBlur={(e) => updatePhotoLocation(ph, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.target.blur();
                        }
                      }}
                      title="Edit text after dot. Press Enter or click away to save."
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
      {!photos.length && (
        <p className="empty-state" style={{ marginTop: "1rem" }}>
          No photographs match this category or project filter.
        </p>
      )}
    </>
  );
}
