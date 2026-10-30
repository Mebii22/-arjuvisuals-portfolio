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

const existingServices = storage.read(KEYS.services, null);
const hasLegacyServices =
  Array.isArray(existingServices) &&
  existingServices.some(
    (s) => typeof s.cover === "string" && s.cover.includes("pexels.com")
  );
if (!existingServices || hasLegacyServices) {
  storage.write(KEYS.services, defaultServices);
} else {
  storage.write(KEYS.services, existingServices.map(normalizeServicePath));
}

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
  async list({ includeHidden = false } = {}) {
    if (API_CONFIG.USE_API) return apiRequest("/services");
    const all = local.all();
    return includeHidden ? all : all.filter((s) => s.published);
  },
  async getById(id) {
    return local.all().find((s) => s.id === id) || null;
  },
  async create(payload) {
    if (API_CONFIG.USE_API) {
      return apiRequest("/services", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    const item = { ...payload, id: payload.id || `s-${Date.now()}` };
    local.save([item, ...local.all()]);
    return item;
  },
  async update(id, payload) {
    if (API_CONFIG.USE_API) {
      return apiRequest(`/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }
    const next = local.all().map((s) => (s.id === id ? { ...s, ...payload, id } : s));
    local.save(next);
    return next.find((s) => s.id === id);
  },
  async remove(id) {
    if (API_CONFIG.USE_API) {
      return apiRequest(`/services/${id}`, { method: "DELETE" });
    }
    local.save(local.all().filter((s) => s.id !== id));
    return true;
  },
};
