import { PHOTOGRAPHY_CATEGORIES, VIDEOGRAPHY_CATEGORIES } from "../data/projects";
import { API_CONFIG, apiRequest, storage } from "./api";

const DISCIPLINES_KEY = "arjuvisuals.disciplines.v1";

const defaultDisciplines = [
  ...PHOTOGRAPHY_CATEGORIES.map((name) => ({
    id: `disc-photo-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    type: "photography",
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  })),
  ...VIDEOGRAPHY_CATEGORIES.map((name) => ({
    id: `disc-video-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    type: "videography",
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  })),
];

export const disciplineService = {
  async list({ type = "all" } = {}) {
    if (API_CONFIG.USE_API) {
      try {
        let endpoint = "/disciplines";
        if (type && type !== "all") {
          endpoint += `?type=${encodeURIComponent(type)}`;
        }
        const res = await apiRequest(endpoint);
        const list = Array.isArray(res) ? res : res && res.data ? res.data : [];
        if (Array.isArray(list) && list.length > 0) {
          storage.write(DISCIPLINES_KEY, list);
          return list;
        }
      } catch (err) {
        console.warn("Discipline fetch failed, using local cache:", err.message);
      }
    }

    const cached = storage.read(DISCIPLINES_KEY, defaultDisciplines);
    const list = Array.isArray(cached) && cached.length > 0 ? cached : defaultDisciplines;
    if (type && type !== "all") {
      return list.filter((d) => d.type === type);
    }
    return list;
  },

  async create({ name, type = "photography" }) {
    const cleanName = String(name || "").trim();
    if (!cleanName) {
      throw new Error("Discipline name cannot be empty.");
    }

    if (API_CONFIG.USE_API) {
      const res = await apiRequest("/disciplines", {
        method: "POST",
        body: JSON.stringify({ name: cleanName, type }),
      });
      const created = res && res.data ? res.data : res;

      // Update local storage cache
      const cached = storage.read(DISCIPLINES_KEY, defaultDisciplines);
      const updated = [...cached.filter((d) => d.name.toLowerCase() !== cleanName.toLowerCase()), created];
      storage.write(DISCIPLINES_KEY, updated);

      return created;
    }

    // Local fallback
    const cached = storage.read(DISCIPLINES_KEY, defaultDisciplines);
    const exists = cached.some((d) => d.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      throw new Error(`Discipline "${cleanName}" already exists.`);
    }

    const newItem = {
      id: `disc-custom-${Date.now()}`,
      name: cleanName,
      type: type === "videography" ? "videography" : "photography",
      slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    const updated = [...cached, newItem];
    storage.write(DISCIPLINES_KEY, updated);
    return newItem;
  },

  async remove(id) {
    if (API_CONFIG.USE_API) {
      await apiRequest(`/disciplines/${id}`, { method: "DELETE" });
    }
    const cached = storage.read(DISCIPLINES_KEY, defaultDisciplines);
    storage.write(DISCIPLINES_KEY, cached.filter((d) => d.id !== id && d._id !== id));
    return true;
  },
};

