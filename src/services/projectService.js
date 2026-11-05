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
export const mapBackendToFrontend = (b) => {
  if (!b) return null;
  const id = b._id || b.id;
  const isVideo = b.type === "videography" || b.category === "videography";
  const type = isVideo ? "videography" : "photography";
  const cover = b.cover || b.coverImage || b.thumbnail || "";
  const thumbnail = b.thumbnail || cover;

  // Stills / gallery with individual item metadata support
  const rawGallery = Array.isArray(b.gallery) && b.gallery.length > 0
    ? b.gallery
    : (Array.isArray(b.images) && b.images.length > 0
      ? b.images
      : (Array.isArray(b.videoStills) && b.videoStills.length > 0 ? b.videoStills : []));

  const photoLocations = b.photoLocations || {};
  const gallery = rawGallery.map((item) => {
    if (!item) return null;
    if (typeof item === "string") {
      return {
        image: item,
        location: photoLocations[item] || b.location || "",
        caption: "",
      };
    }
    return {
      image: item.image || item.src || item.url || "",
      location: item.location !== undefined ? item.location : (photoLocations[item.image || item.src] || b.location || ""),
      caption: item.caption || item.alt || "",
    };
  }).filter(Boolean);

  const rawStills = Array.isArray(b.videoStills) && b.videoStills.length > 0
    ? b.videoStills
    : gallery;
  const videoStills = rawStills.map((item) => {
    if (!item) return null;
    if (typeof item === "string") {
      return {
        image: item,
        location: photoLocations[item] || b.location || "",
        caption: "",
      };
    }
    return {
      image: item.image || item.src || item.url || "",
      location: item.location !== undefined ? item.location : (photoLocations[item.image || item.src] || b.location || ""),
      caption: item.caption || item.alt || "",
    };
  }).filter(Boolean);

  // Determine display category from subCategory, legacy map, title or default
  const slugKey = b.slug || (b.title ? projectService.slugify(b.title) : id);
  const matchedInfo =
    LEGACY_PROJECT_INFO[slugKey] ||
    LEGACY_PROJECT_INFO[id] ||
    LEGACY_PROJECT_INFO[b.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-")];

  let rawCat = b.category;
  if (!rawCat || rawCat.toLowerCase() === "photography" || rawCat.toLowerCase() === "videography") {
    rawCat = b.subCategory && b.subCategory.toLowerCase() !== "photography" && b.subCategory.toLowerCase() !== "videography"
      ? b.subCategory
      : (matchedInfo ? matchedInfo.category : null);
  }

  if (!rawCat || rawCat.toLowerCase() === "photography" || rawCat.toLowerCase() === "videography") {
    const titleLower = String(b.title || "").toLowerCase();
    if (titleLower.includes("wedding film") || titleLower.includes("backwaters")) rawCat = "Wedding Films";
    else if (titleLower.includes("cinematic") || titleLower.includes("monsoon")) rawCat = "Cinematic Films";
    else if (titleLower.includes("commercial video") || titleLower.includes("makers")) rawCat = "Commercial Videos";
    else if (titleLower.includes("wedding")) rawCat = "Wedding Photography";
    else if (titleLower.includes("portrait")) rawCat = "Portrait Photography";
    else if (titleLower.includes("nature")) rawCat = "Nature Photography";
    else if (titleLower.includes("travel")) rawCat = "Travel Photography";
    else if (titleLower.includes("fashion")) rawCat = "Fashion Photography";
    else if (titleLower.includes("event")) rawCat = "Event Photography";
    else if (titleLower.includes("product")) rawCat = "Product Photography";
    else rawCat = isVideo ? "Cinematic Films" : "Wedding Photography";
  }
  const category = rawCat;

  return {
    ...b,
    id,
    _id: id,
    title: b.title || "",
    slug: slugKey,
    description: b.description || b.short || "",
    short: b.short || b.description || "",
    type,
    category,
    subCategory: category,
    cover,
    coverImage: cover,
    thumbnail,
    gallery,
    images: gallery,
    videoStills: Array.isArray(b.videoStills) && b.videoStills.length > 0 ? b.videoStills : gallery,
    status: b.status || "draft",
    featured: Boolean(b.featured),
    videoUrl: b.videoUrl || "",
    location: b.location || "",
    shootDate: b.shootDate || "",
    duration: b.duration || "",
    videoProvider: b.videoProvider || (b.videoUrl && b.videoUrl.includes("vimeo") ? "vimeo" : "youtube"),
    photoLocations: b.photoLocations || {},
  };
};

export const mapFrontendToBackend = (f) => {
  if (!f) return {};
  const mapped = {};

  if (f.title !== undefined) {
    mapped.title = String(f.title).trim();
  }
  if (f.description !== undefined || f.short !== undefined) {
    mapped.description = String(f.description || f.short || f.title || "").trim();
  }
  if (f.type !== undefined) {
    mapped.type = f.type === "videography" ? "videography" : "photography";
  }
  if (f.category !== undefined) {
    mapped.category = String(f.category).trim();
    mapped.subCategory = String(f.category).trim();
  }
  if (f.cover !== undefined || f.coverImage !== undefined || f.thumbnail !== undefined) {
    const c = (f.cover || f.coverImage || f.thumbnail || "").trim();
    mapped.cover = c;
    mapped.coverImage = c;
    mapped.thumbnail = (f.thumbnail || c).trim();
  }
  if (f.gallery !== undefined || f.images !== undefined || f.videoStills !== undefined) {
    const rawG = Array.isArray(f.gallery)
      ? f.gallery
      : (Array.isArray(f.images) ? f.images : (Array.isArray(f.videoStills) ? f.videoStills : []));

    const photoLocations = { ...(f.photoLocations || {}) };
    const cleanG = rawG.map((item) => {
      if (typeof item === "string") return item;
      if (item && item.image) {
        if (item.location) photoLocations[item.image] = item.location;
        return {
          image: item.image,
          location: item.location || "",
          caption: item.caption || "",
        };
      }
      return null;
    }).filter(Boolean);

    mapped.gallery = cleanG;
    mapped.images = cleanG;
    mapped.photoLocations = photoLocations;

    if (f.videoStills !== undefined) {
      mapped.videoStills = (Array.isArray(f.videoStills) ? f.videoStills : []).map((item) => {
        if (typeof item === "string") return item;
        if (item && item.image) {
          return {
            image: item.image,
            location: item.location || "",
            caption: item.caption || "",
          };
        }
        return null;
      }).filter(Boolean);
    } else {
      mapped.videoStills = cleanG;
    }
  }
  if (f.status !== undefined) {
    mapped.status = f.status === "published" ? "published" : "draft";
  }
  if (f.featured !== undefined) {
    mapped.featured = Boolean(f.featured);
  }
  if (f.videoUrl !== undefined) {
    mapped.videoUrl = String(f.videoUrl).trim();
  }
  if (f.videoProvider !== undefined) {
    mapped.videoProvider = String(f.videoProvider).trim();
  }
  if (f.duration !== undefined) {
    mapped.duration = String(f.duration).trim();
  }
  if (f.shootDate !== undefined) {
    mapped.shootDate = String(f.shootDate).trim();
  }
  if (f.location !== undefined) {
    mapped.location = String(f.location).trim();
  }
  if (f.short !== undefined) {
    mapped.short = String(f.short).trim();
  }
  if (f.photoLocations !== undefined) {
    mapped.photoLocations = f.photoLocations;
  }
  if (f.slug !== undefined) {
    mapped.slug = f.slug;
  } else if (f.title !== undefined) {
    mapped.slug = projectService.slugify(f.title);
  }

  return mapped;
};

export const projectService = {
  async list({ includeDrafts = false, status = "all" } = {}) {
    if (API_CONFIG.USE_API) {
      try {
        let endpoint = "/projects";
        if (includeDrafts) {
          endpoint = "/projects/admin/all";
          if (status && status !== "all") {
            endpoint += `?status=${encodeURIComponent(status)}`;
          }
        } else {
          const query = new URLSearchParams();
          if (status && status !== "all") query.set("status", status);
          const qs = query.toString();
          if (qs) endpoint += `?${qs}`;
        }

        const res = await apiRequest(endpoint);
        const rawList = Array.isArray(res) ? res : (res && res.data ? res.data : []);
        return rawList.map(mapBackendToFrontend);
      } catch (err) {
        if (includeDrafts) {
          throw err;
        }
        console.warn("API project listing failed, falling back to local storage:", err.message);
      }
    }
    const all = local.all();
    if (status && status !== "all") {
      return all.filter((p) => p.status === status);
    }
    return includeDrafts ? all : all.filter((p) => p.status === "published");
  },

  async getBySlug(slug, { includeDrafts = false } = {}) {
    const item = await this.getBySlugAny(slug);
    if (!item) return null;
    if (!includeDrafts && item.status !== "published") return null;
    return item;
  },

  /**
   * Returns project by slug or ID regardless of publication status.
   * Useful for distinguishing between a 404 and an unpublished draft,
   * and enabling authenticated admin previews of draft projects.
   */
  async getBySlugAny(slug) {
    if (API_CONFIG.USE_API) {
      // 1. If slug is a valid 24-char MongoDB ObjectId, query by ID directly
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        const item = await this.getById(slug);
        if (item) return item;
      }

      // 2. Search public published projects first (no admin token required)
      try {
        const pubProjects = await this.list({ includeDrafts: false });
        const matched = pubProjects.find(
          (p) => p.slug === slug || p.id === slug || this.slugify(p.title) === slug
        );
        if (matched) return matched;
      } catch {
        // Fall through
      }

      // 3. If not found in public and admin session token exists, query admin projects (allows draft preview)
      const token =
        typeof sessionStorage !== "undefined"
          ? sessionStorage.getItem("arjuvisuals.adminSession")
          : null;
      if (token && token !== "prototype") {
        try {
          const adminProjects = await this.list({ includeDrafts: true });
          const matchedAdmin = adminProjects.find(
            (p) => p.slug === slug || p.id === slug || this.slugify(p.title) === slug
          );
          if (matchedAdmin) return matchedAdmin;
        } catch {
          // Fall through
        }
      }

      return null;
    }
    return local.all().find((p) => p.slug === slug) || null;
  },

  async getById(id) {
    if (API_CONFIG.USE_API) {
      try {
        const res = await apiRequest(`/projects/${id}`);
        const raw = res && res.data ? res.data : res;
        return mapBackendToFrontend(raw);
      } catch {
        return null;
      }
    }
    return local.all().find((p) => p.id === id) || null;
  },

  async create(payload) {
    if (API_CONFIG.USE_API) {
      const backendPayload = mapFrontendToBackend(payload);
      const res = await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(backendPayload),
      });
      const raw = res && res.data ? res.data : res;
      return mapBackendToFrontend(raw);
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
      const backendPayload = mapFrontendToBackend(payload);
      const res = await apiRequest(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(backendPayload),
      });
      const raw = res && res.data ? res.data : res;
      return mapBackendToFrontend(raw);
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
      await apiRequest(`/projects/${id}`, { method: "DELETE" });
      return true;
    }
    local.save(local.all().filter((p) => p.id !== id));
    return true;
  },

  async migrateFromLocalStorage() {
    if (!API_CONFIG.USE_API) return { success: false, message: "API is not enabled" };

    // 1. Fetch current backend projects to avoid duplicates
    const currentBackend = await this.list({ includeDrafts: true });
    const existingTitles = new Set(
      (currentBackend || []).map((p) => (p.title || "").toLowerCase().trim())
    );
    const existingSlugs = new Set(
      (currentBackend || [])
        .map((p) => (p.slug || "").toLowerCase().trim())
        .filter(Boolean)
    );

    // 2. Read from localStorage (fallback to defaultProjects)
    const rawLocal = storage.read(KEYS.projects, defaultProjects);
    const sourceList =
      Array.isArray(rawLocal) && rawLocal.length > 0 ? rawLocal : defaultProjects;

    const results = {
      imported: 0,
      skipped: 0,
      errors: [],
    };

    for (const item of sourceList) {
      if (!item || item.id === "p-open-face" || item.slug === "open-face") continue;

      const title = (item.title || "").toLowerCase().trim();
      const slug = (item.slug || this.slugify(item.title) || "").toLowerCase().trim();

      // Check if project already exists on the backend
      if (existingTitles.has(title) || (slug && existingSlugs.has(slug))) {
        results.skipped++;
        continue;
      }

      try {
        await this.create(item);
        existingTitles.add(title);
        if (slug) existingSlugs.add(slug);
        results.imported++;
      } catch (err) {
        results.errors.push({ title: item.title, error: err.message });
      }
    }

    return results;
  },

  slugify(title) {
    return String(title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  },
};
