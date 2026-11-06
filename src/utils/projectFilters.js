import { PHOTOGRAPHY_CATEGORIES, VIDEOGRAPHY_CATEGORIES } from "../data/projects.js";

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
 * Generates filters dynamically ONLY from published projects.
 *
 * - If an admin creates a new discipline but no published project uses it, it will NOT show publicly.
 * - If the only project using a discipline is changed to Draft, it disappears automatically.
 * - If all projects using a discipline are deleted, it disappears automatically.
 * - If a new published project uses a new discipline, it appears automatically.
 * - Does not hardcode categories.
 */
export function getCategoriesForType(type = "all", projects = []) {
  // 1. Strictly filter projects where status === "published"
  const publishedProjects = (projects || []).filter(
    (project) => project.status === "published"
  );

  // 2. Filter by active medium / type (photography vs videography)
  const matchingProjects = publishedProjects.filter((project) => {
    if (type === "all") return true;
    const pType = project.type || "photography";
    return pType === type;
  });

  // 3. Extract unique disciplines dynamically ONLY from published projects
  const disciplines = [];
  matchingProjects.forEach((project) => {
    const discipline = project.discipline || project.category || project.subCategory;
    if (discipline && !disciplines.some((d) => norm(d) === norm(discipline))) {
      disciplines.push(discipline);
    }
  });

  return disciplines;
}

export const getPublishedDisciplines = getCategoriesForType;

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
