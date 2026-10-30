import { defaultProjects } from "../data/projects";
import { API_CONFIG, apiRequest, storage, KEYS } from "./api";

const LEGACY_FOLDER_MAP = {
  "vows-in-quiet-light": "wedding-photography",
  "after-light": "portrait-photography",
  "silk-and-shadow": "fashion-photography",
  "crowd-and-colour": "event-photography",
  "far-from-here": "travel-photography",
  "green-hour": "nature-photography",
  "still-object": "product-photography",
};

const LEGACY_PROJECT_INFO = {
  "wedding-photography": {
    id: "p-wedding",
    title: "Wedding Photography",
    slug: "wedding-photography",
    category: "Wedding Photography",
  },
  "vows-in-quiet-light": {
    id: "p-wedding",
    title: "Wedding Photography",
    slug: "wedding-photography",
    category: "Wedding Photography",
  },
  "portrait-photography": {
    id: "p-portrait",
    title: "Portrait Photography",
    slug: "portrait-photography",
    category: "Portrait Photography",
  },
  "after-light": {
    id: "p-portrait",
    title: "Portrait Photography",
    slug: "portrait-photography",
    category: "Portrait Photography",
  },
  "fashion-photography": {
    id: "p-fashion",
    title: "Fashion Photography",
    slug: "fashion-photography",
    category: "Fashion Photography",
  },
  "silk-and-shadow": {
    id: "p-fashion",
    title: "Fashion Photography",
    slug: "fashion-photography",
    category: "Fashion Photography",
  },
  "event-photography": {
    id: "p-event",
    title: "Event Photography",
    slug: "event-photography",
    category: "Event Photography",
  },
  "crowd-and-colour": {
    id: "p-event",
    title: "Event Photography",
    slug: "event-photography",
    category: "Event Photography",
  },
  "travel-photography": {
    id: "p-travel",
    title: "Travel Photography",
    slug: "travel-photography",
    category: "Travel Photography",
  },
  "far-from-here": {
    id: "p-travel",
    title: "Travel Photography",
    slug: "travel-photography",
    category: "Travel Photography",
  },
  "nature-photography": {
    id: "p-nature",
    title: "Nature Photography",
    slug: "nature-photography",
    category: "Nature Photography",
  },
  "green-hour": {
    id: "p-nature",
    title: "Nature Photography",
    slug: "nature-photography",
    category: "Nature Photography",
  },
  "product-photography": {
    id: "p-product",
    title: "Product Photography",
    slug: "product-photography",
    category: "Product Photography",
  },
  "still-object": {
    id: "p-product",
    title: "Product Photography",
    slug: "product-photography",
    category: "Product Photography",
  },
};

const normalizeImagePath = (path) => {
  if (typeof path !== "string") return path;
  let normalized = path;
  Object.entries(LEGACY_FOLDER_MAP).forEach(([oldFolder, newFolder]) => {
    if (normalized.includes(`/projects/${oldFolder}/`)) {
      normalized = normalized.replaceAll(`/projects/${oldFolder}/`, `/projects/${newFolder}/`);
    }
  });
  return normalized;
};

const migrateProject = (p) => {
  if (!p) return p;
  const legacyKey =
    p.slug ||
    (p.id ? p.id.replace(/^p-/, "") : null) ||
    (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : null);

  const matchedInfo =
    LEGACY_PROJECT_INFO[legacyKey] ||
    LEGACY_PROJECT_INFO[p.id] ||
    (p.category && LEGACY_PROJECT_INFO[p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")]);

  const defaultProj = defaultProjects.find(
    (dp) => dp.id === p.id || dp.slug === (matchedInfo ? matchedInfo.slug : p.slug)
  );
  let gallery = (p.gallery || []).map(normalizeImagePath);
  if (defaultProj && Array.isArray(defaultProj.gallery)) {
    // Ensure all canonical frames (frame-01 through frame-05) are present
    defaultProj.gallery.forEach((frame) => {
      if (!gallery.includes(frame)) {
        gallery.push(frame);
      }
    });
  }

  return {
    ...p,
    title: matchedInfo ? matchedInfo.title : p.title,
    slug: matchedInfo ? matchedInfo.slug : p.slug,
    category: matchedInfo ? matchedInfo.category : p.category,
    id: matchedInfo ? matchedInfo.id : p.id,
    type: p.type || (defaultProj ? defaultProj.type : "photography"),
    cover: normalizeImagePath(p.cover) || (defaultProj ? defaultProj.cover : ""),
    gallery,
    status: p.status || (defaultProj ? defaultProj.status : "published"),
    featured: typeof p.featured === "boolean" ? p.featured : (defaultProj ? defaultProj.featured : false),
    photoLocations: p.photoLocations || {},
    videoUrl: p.videoUrl || (defaultProj ? defaultProj.videoUrl || "" : ""),
    videoProvider: p.videoProvider || (defaultProj ? defaultProj.videoProvider || "" : ""),
    duration: p.duration || (defaultProj ? defaultProj.duration || "" : ""),
  };
};

const DRAFT_MIGRATION_FLAG = "arjuvisuals.draft_status_migrated_v2";

const seed = () => {
  const existing = storage.read(KEYS.projects, null);
  const hasLegacyPexels =
    Array.isArray(existing) &&
    existing.some((p) => typeof p.cover === "string" && p.cover.includes("pexels.com"));

  if (!existing || hasLegacyPexels || !Array.isArray(existing) || existing.length === 0) {
    storage.write(KEYS.projects, defaultProjects);
    storage.write(DRAFT_MIGRATION_FLAG, true);
    return;
  }

  const cleaned = existing.filter((p) => p.id !== "p-open-face" && p.slug !== "open-face");
  let migrated = cleaned.map(migrateProject);

  // If existing storage only had photography, merge default videography projects
  const hasVideography = migrated.some((p) => p.type === "videography");
  if (!hasVideography) {
    const defaultVideos = defaultProjects.filter((p) => p.type === "videography");
    migrated.push(...defaultVideos);
  }

  // One-time migration: Hide existing demo / placeholder projects in Event, Fashion, and Product
  // Keep any genuine original projects that replaced demo images
  const hasMigratedDrafts = storage.read(DRAFT_MIGRATION_FLAG, false);
  if (!hasMigratedDrafts) {
    const demoTargetIds = ["p-fashion", "p-event", "p-product"];
    const demoTargetSlugs = ["fashion-photography", "event-photography", "product-photography"];

    migrated = migrated.map((p) => {
      const isTarget = demoTargetIds.includes(p.id) || demoTargetSlugs.includes(p.slug);
      // Identify demo / placeholder items: check placeholder flag or default demo asset paths
      const isDemo =
        isTarget &&
        (p.placeholder ||
          (typeof p.cover === "string" &&
            (p.cover.includes("/projects/event-photography/") ||
              p.cover.includes("/projects/fashion-photography/") ||
              p.cover.includes("/projects/product-photography/") ||
              p.cover.includes("pexels.com"))));

      if (isDemo) {
        return {
          ...p,
          status: "draft",
          featured: false,
        };
      }
      return p;
    });

    storage.write(DRAFT_MIGRATION_FLAG, true);
  }

  storage.write(KEYS.projects, migrated);
};

seed();

const local = {
  all() {
    const list = storage.read(KEYS.projects, defaultProjects);
    return Array.isArray(list)
      ? list.filter((p) => p.id !== "p-open-face" && p.slug !== "open-face").map(migrateProject)
      : defaultProjects;
  },
  save(list) {
    const cleaned = (list || [])
      .filter((p) => p.id !== "p-open-face" && p.slug !== "open-face")
      .map(migrateProject);
    storage.write(KEYS.projects, cleaned);
    return cleaned;
  },
};

/**
 * Project Service
 * 
 * Ready for Node.js / Express.js / MongoDB Atlas / Cloudinary integration.
 * Set API_CONFIG.USE_API = true in api.js when Express backend is running.
 *
 * REST Endpoints:
 * - GET    /api/projects            -> Published projects only (for public website)
 * - GET    /api/projects?all=1      -> All projects including drafts (for admin dashboard)
 * - GET    /api/projects?status=... -> Projects filtered by status ('published' | 'draft')
 * - GET    /api/projects/slug/:slug -> Project by slug (public checks status === 'published')
 * - GET    /api/projects/:id        -> Project by ID
 * - POST   /api/projects            -> Create project (draft or published)
 * - PUT    /api/projects/:id        -> Update project
 * - DELETE /api/projects/:id        -> Delete project
 */
export const projectService = {
  async list({ includeDrafts = false, status = "all" } = {}) {
    if (API_CONFIG.USE_API) {
      const query = new URLSearchParams();
      if (includeDrafts) query.set("all", "1");
      if (status && status !== "all") query.set("status", status);
      const qs = query.toString();
      const data = await apiRequest(`/projects${qs ? `?${qs}` : ""}`);
      return data;
    }
    const all = local.all();
    if (status && status !== "all") {
      return all.filter((p) => p.status === status);
    }
    return includeDrafts ? all : all.filter((p) => p.status === "published");
  },

  async getBySlug(slug, { includeDrafts = false } = {}) {
    if (API_CONFIG.USE_API) {
      return apiRequest(`/projects/slug/${slug}${includeDrafts ? "?all=1" : ""}`);
    }
    const item = local.all().find((p) => p.slug === slug) || null;
    if (!item) return null;
    if (!includeDrafts && item.status !== "published") return null;
    return item;
  },

  /**
   * Returns project by slug regardless of publication status.
   * Useful for distinguishing between a 404 (non-existent) and an unpublished draft,
   * and enabling authenticated admin previews of draft projects.
   */
  async getBySlugAny(slug) {
    if (API_CONFIG.USE_API) {
      return apiRequest(`/projects/slug/${slug}?all=1`);
    }
    return local.all().find((p) => p.slug === slug) || null;
  },

  async getById(id) {
    if (API_CONFIG.USE_API) return apiRequest(`/projects/${id}`);
    return local.all().find((p) => p.id === id) || null;
  },

  async create(payload) {
    if (API_CONFIG.USE_API) {
      return apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    const all = local.all();
    const item = {
      ...payload,
      id: payload.id || `p-${Date.now()}`,
      status: payload.status || "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    local.save([item, ...all]);
    return item;
  },

  async update(id, payload) {
    if (API_CONFIG.USE_API) {
      return apiRequest(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }
    const all = local.all();
    const next = all.map((p) =>
      p.id === id
        ? {
            ...p,
            ...payload,
            id,
            updatedAt: new Date().toISOString(),
          }
        : p
    );
    local.save(next);
    return next.find((p) => p.id === id);
  },

  async publish(id) {
    return this.update(id, { status: "published" });
  },

  async unpublish(id) {
    return this.update(id, { status: "draft" });
  },

  async remove(id) {
    if (API_CONFIG.USE_API) {
      return apiRequest(`/projects/${id}`, { method: "DELETE" });
    }
    local.save(local.all().filter((p) => p.id !== id));
    return true;
  },

  slugify(title) {
    return String(title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  },
};
