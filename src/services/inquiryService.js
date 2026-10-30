import { defaultInquiries } from "../data/demoInquiries";
import { API_CONFIG, apiRequest, storage, KEYS } from "./api";

if (!storage.read(KEYS.inquiries, null)) {
  storage.write(KEYS.inquiries, defaultInquiries);
}

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
    if (API_CONFIG.USE_API) return apiRequest("/inquiries");
    return local.all();
  },
  async getById(id) {
    return local.all().find((i) => i.id === id) || null;
  },
  async create(payload) {
    if (API_CONFIG.USE_API) {
      return apiRequest("/inquiries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
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
    const next = local.all().map((i) => (i.id === id ? { ...i, ...payload, id } : i));
    local.save(next);
    return next.find((i) => i.id === id);
  },
  async remove(id) {
    local.save(local.all().filter((i) => i.id !== id));
    return true;
  },
};
