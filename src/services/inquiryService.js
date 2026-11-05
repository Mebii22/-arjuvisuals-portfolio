import { defaultInquiries } from "../data/demoInquiries";
import { API_CONFIG, apiRequest, storage, KEYS } from "./api";

const mapInquiry = (i) => {
  if (!i) return null;
  return {
    ...i,
    id: i._id || i.id,
    _id: i._id || i.id,
  };
};

const local = {
  all() {
    return storage.read(KEYS.inquiries, defaultInquiries);
  },
  save(list) {
    storage.write(KEYS.inquiries, list);
    return list;
  },
};

export const inquiryService = {
  async list() {
    if (API_CONFIG.USE_API) {
      try {
        const res = await apiRequest("/inquiries");
        const list = Array.isArray(res) ? res : res?.data || [];
        return list.map(mapInquiry);
      } catch (err) {
        console.warn("API inquiry listing failed, falling back to local storage:", err.message);
        return local.all().map(mapInquiry);
      }
    }
    return local.all().map(mapInquiry);
  },

  async getById(id) {
    if (API_CONFIG.USE_API) {
      try {
        const res = await apiRequest(`/inquiries/${id}`);
        const data = res && res.data ? res.data : res;
        return mapInquiry(data);
      } catch {
        // Fall back to local
      }
    }
    const item = local.all().find((i) => i.id === id || i._id === id);
    return item ? mapInquiry(item) : null;
  },

  async create(payload) {
    if (API_CONFIG.USE_API) {
      const res = await apiRequest("/inquiries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = res && res.data ? res.data : res;
      return mapInquiry(data);
    }
    const item = {
      ...payload,
      id: `inq-${Date.now()}`,
      status: "new",
      notes: "",
      createdAt: new Date().toISOString(),
      demo: true,
    };
    local.save([item, ...local.all()]);
    return item;
  },

  async update(id, payload) {
    if (API_CONFIG.USE_API) {
      const res = await apiRequest(`/inquiries/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = res && res.data ? res.data : res;
      return mapInquiry(data);
    }
    const next = local.all().map((i) => (i.id === id ? { ...i, ...payload, id } : i));
    local.save(next);
    return next.find((i) => i.id === id);
  },

  async remove(id) {
    if (API_CONFIG.USE_API) {
      await apiRequest(`/inquiries/${id}`, { method: "DELETE" });
      return true;
    }
    local.save(local.all().filter((i) => i.id !== id && i._id !== id));
    return true;
  },
};
