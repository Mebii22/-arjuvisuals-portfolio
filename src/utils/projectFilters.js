import { PHOTOGRAPHY_CATEGORIES, VIDEOGRAPHY_CATEGORIES } from "../data/projects";

export { PHOTOGRAPHY_CATEGORIES, VIDEOGRAPHY_CATEGORIES };

/**
 * Normalizes text for case-insensitive matching across categories, slugs, and disciplines.
 */
export const norm = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/( photography| videos?| films?)$/i, "")
    .trim();

export const normCategory = norm;

/**
 * Returns available categories according to selected primary portfolio type.
 * Supports dynamic categories from projects created by admin.
 */
export function getCategoriesForType(type = "all", projects = [], { onlyExisting = false } = {}) {
  if (onlyExisting) {
    const presentCats = new Set();
    (projects || []).forEach((p) => {
      const pType = p.type || "photography";
      if (type === "all" || pType === type) {
        if (p.category) presentCats.add(p.category);
      }
    });

    if (type === "photography") {
      const ordered = PHOTOGRAPHY_CATEGORIES.filter((c) =>
        Array.from(presentCats).some((pc) => norm(pc) === norm(c))
      );
      presentCats.forEach((pc) => {
        if (!ordered.some((o) => norm(o) === norm(pc))) ordered.push(pc);
      });
      return ordered;
    }

    if (type === "videography") {
      const ordered = VIDEOGRAPHY_CATEGORIES.filter((c) =>
        Array.from(presentCats).some((pc) => norm(pc) === norm(c))
      );
      presentCats.forEach((pc) => {
        if (!ordered.some((o) => norm(o) === norm(pc))) ordered.push(pc);
      });
      return ordered;
    }

    // Unified for "All Works"
    const orderedBase = [
      "Wedding",
      "Portrait",
      "Fashion",
      "Event",
      "Travel",
      "Nature",
      "Product",
      "Cinematic Films",
      "Commercial Videos",
      "Music Videos",
      "Reels & Short Films",
    ];
    const ordered = orderedBase.filter((c) =>
      Array.from(presentCats).some((pc) => norm(pc) === norm(c))
    );
    presentCats.forEach((pc) => {
      if (!ordered.some((o) => norm(o) === norm(pc))) ordered.push(pc);
    });
    return ordered;
  }

  if (type === "photography") {
    const list = [...PHOTOGRAPHY_CATEGORIES];
    // Collect any custom categories added by admin to photography projects
    (projects || []).forEach((p) => {
      const pType = p.type || "photography";
      if (pType === "photography" && p.category && !list.some((c) => norm(c) === norm(p.category))) {
        list.push(p.category);
      }
    });
    return list;
  }

  if (type === "videography") {
    const list = [...VIDEOGRAPHY_CATEGORIES];
    // Collect any custom categories added by admin to videography projects
    (projects || []).forEach((p) => {
      if (p.type === "videography" && p.category && !list.some((c) => norm(c) === norm(p.category))) {
        list.push(p.category);
      }
    });
    return list;
  }

  // Unified non-duplicated categories for "All Works"
  const unified = [
    "Wedding",
    "Portrait",
    "Fashion",
    "Event",
    "Travel",
    "Nature",
    "Product",
    "Cinematic Films",
    "Commercial Videos",
    "Music Videos",
    "Reels & Short Films",
  ];

  (projects || []).forEach((p) => {
    if (p.category && !unified.some((u) => norm(u) === norm(p.category))) {
      unified.push(p.category);
    }
  });

  return unified;
}

/**
 * Detects provider and normalizes embedded player URLs.
 * Supports YouTube, Vimeo, and direct MP4/video files.
 */
export function getVideoEmbedInfo(rawUrl = "", explicitProvider = "") {
  const url = String(rawUrl || "").trim();
  if (!url) {
    return { provider: "none", type: "none", embedUrl: "", url: "", isDirect: false, isValid: false };
  }

  // Explicit or auto-detected YouTube
  const isYouTube =
    explicitProvider === "youtube" ||
    url.includes("youtube.com") ||
    url.includes("youtu.be");

  if (isYouTube) {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1]?.split(/[?#]/)[0] || "";
    }

    if (videoId) {
      return {
        provider: "youtube",
        type: "youtube",
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        url,
        isDirect: false,
        isValid: true,
      };
    }
  }

  // Explicit or auto-detected Vimeo
  const isVimeo = explicitProvider === "vimeo" || url.includes("vimeo.com");
  if (isVimeo) {
    const matches = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    const videoId = matches?.[3] || url.split("vimeo.com/").pop()?.split(/[?#]/)[0] || "";
    if (videoId && /^\d+$/.test(videoId)) {
      return {
        provider: "vimeo",
        type: "vimeo",
        videoId,
        embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1&title=0&byline=0&portrait=0`,
        watchUrl: `https://vimeo.com/${videoId}`,
        url,
        isDirect: false,
        isValid: true,
      };
    }
  }

  // Direct MP4 / WebM video files or Device Uploads (IndexedDB, Blob, Data URLs)
  const isDirect =
    explicitProvider === "mp4" ||
    explicitProvider === "direct" ||
    explicitProvider === "device" ||
    url.startsWith("blob:") ||
    url.startsWith("data:video") ||
    url.startsWith("idb://") ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  if (isDirect) {
    return {
      provider: url.startsWith("idb://") || url.startsWith("blob:") ? "device" : "mp4",
      type: "video",
      embedUrl: url,
      watchUrl: url,
      url,
      isDirect: true,
      isValid: true,
    };
  }

  // Fallback: treat as external if valid URL
  if (/^https?:\/\//i.test(url)) {
    return {
      provider: explicitProvider || "external",
      type: "external",
      embedUrl: url,
      watchUrl: url,
      url,
      isDirect: false,
      isValid: true,
    };
  }

  return { provider: "unknown", type: "none", embedUrl: url, url, isDirect: false, isValid: false };
}

/**
 * Centralized filtering for projects across public views and admin.
 */
export function filterProjects(projects = [], options = {}) {
  const {
    type = "all",
    category = "all",
    status = "published",
    search = "",
    featuredOnly = false,
  } = options;

  return projects.filter((project) => {
    // 1. Publication status
    if (status !== "all" && project.status !== status) {
      return false;
    }

    // 2. Featured filter
    if (featuredOnly && !project.featured) {
      return false;
    }

    // 3. Portfolio primary type (photography | videography)
    if (type !== "all") {
      const pType = project.type || "photography";
      if (pType !== type) return false;
    }

    // 4. Category filter
    if (category && category !== "all" && category !== "All") {
      const targetNorm = norm(category);
      const projectNorm = norm(project.category);
      if (targetNorm !== projectNorm) return false;
    }

    // 5. Search query
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = (project.title || "").toLowerCase().includes(q);
      const matchCat = (project.category || "").toLowerCase().includes(q);
      const matchLoc = (project.location || "").toLowerCase().includes(q);
      const matchDesc = (project.short || "").toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchLoc && !matchDesc) {
        return false;
      }
    }

    return true;
  });
}
