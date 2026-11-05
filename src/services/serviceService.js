import { defaultServices } from "../data/services";
import { API_CONFIG, apiRequest, storage, KEYS } from "./api";

const normalizeServicePath = (s) => {
  if (!s || typeof s.cover !== "string") return s;
  let cover = s.cover
    .replace("/projects/vows-in-quiet-light/", "/projects/wedding-photography/")
    .replace("/projects/after-light/", "/projects/portrait-photography/")
    .replace("/projects/silk-and-shadow/", "/projects/fashion-photography/")
    .replace("/projects/crowd-and-colour/", "/projects/event-photography/")
    .replace("/projects/far-from-here/", "/projects/travel-photography/")
    .replace("/projects/green-hour/", "/projects/nature-photography/")
    .replace("/projects/still-object/", "/projects/product-photography/");
  return { ...s, cover };
};

const mapBackendToFrontend = (s) => {
  if (!s) return null;
  const isPublished = s.status === "published" || s.published === true;
  return {
    id: s._id || s.id,
    _id: s._id || s.id,
    title: s.title || "",
    slug: s.slug || "",
    description: s.description || "",
    category: s.category || "photography",
    status: isPublished ? "published" : "draft",
    published: isPublished,
    cover: s.cover || "",
    features: Array.isArray(s.features) ? s.features : [],
    startingPrice: s.startingPrice || "",
    featured: Boolean(s.featured),
    order: s.order || 0,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
};

const local = {
  all() {
    const list = storage.read(KEYS.services, defaultServices);
    return Array.isArray(list) ? list.map(normalizeServicePath) : defaultServices;
  },
  save(list) {
    const next = (list || []).map(normalizeServicePath);
    storage.write(KEYS.services, next);
    return next;
  },
};

export const serviceService = {
  async list({ includeHidden = false, status = "all", category = "all" } = {}) {
    if (API_CONFIG.USE_API) {
      try {
        let endpoint = "/services";
        const params = new URLSearchParams();
        if (includeHidden) {
          endpoint = "/services/admin/all";
          if (status && status !== "all") params.set("status", status);
        }
        if (category && category !== "all") {
          params.set("category", category);
        }
        const qs = params.toString();
        if (qs) endpoint += `?${qs}`;

        const res = await apiRequest(endpoint);
        const rawList = Array.isArray(res) ? res : res && res.data ? res.data : [];
        const mapped = rawList.map(mapBackendToFrontend);
        if (Array.isArray(mapped)) {
          storage.write(KEYS.services, mapped);
        }
        return mapped;
      } catch (err) {
        console.warn("API service listing failed, falling back to local storage:", err.message);
      }
    }

    const all = local.all().map(mapBackendToFrontend);
    let list = includeHidden ? all : all.filter((s) => s.published);
    if (status && status !== "all") {
      list = list.filter((s) => s.status === status);
    }
    if (category && category !== "all") {
      list = list.filter((s) => s.category === category);
    }
    return list;
  },

  async getById(id) {
    if (API_CONFIG.USE_API) {
      try {
        const res = await apiRequest(`/services/${id}`);
        const raw = res && res.data ? res.data : res;
        return mapBackendToFrontend(raw);
      } catch (err) {
        console.warn("API getById failed, checking local storage:", err.message);
      }
    }
    const item = local.all().find((s) => s.id === id || s._id === id);
    return item ? mapBackendToFrontend(item) : null;
  },

  async create(payload) {
    if (API_CONFIG.USE_API) {
      const res = await apiRequest("/services", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const created = res && res.data ? res.data : res;
      const mapped = mapBackendToFrontend(created);
      local.save([mapped, ...local.all().filter((s) => s.id !== mapped.id && s._id !== mapped.id)]);
      return mapped;
    }
    const item = { ...payload, id: payload.id || `s-${Date.now()}` };
    local.save([item, ...local.all()]);
    return mapBackendToFrontend(item);
  },

  async update(id, payload) {
    if (API_CONFIG.USE_API) {
      const res = await apiRequest(`/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const updated = res && res.data ? res.data : res;
      const mapped = mapBackendToFrontend(updated);
      local.save(local.all().map((s) => (s.id === id || s._id === id ? mapped : s)));
      return mapped;
    }
    const next = local.all().map((s) => (s.id === id ? { ...s, ...payload, id } : s));
    local.save(next);
    return mapBackendToFrontend(next.find((s) => s.id === id));
  },

  async publish(id) {
    return this.update(id, { status: "published", published: true });
  },

  async unpublish(id) {
    return this.update(id, { status: "draft", published: false });
  },

  async remove(id) {
    if (API_CONFIG.USE_API) {
      await apiRequest(`/services/${id}`, { method: "DELETE" });
      local.save(local.all().filter((s) => s.id !== id && s._id !== id));
      return true;
    }
    local.save(local.all().filter((s) => s.id !== id && s._id !== id));
    return true;
  },
};
