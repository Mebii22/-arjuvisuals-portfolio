import { API_CONFIG, apiRequest } from "./api";

const mapInquiry = (i) => {
  if (!i) return null;
  return {
    ...i,
    id: i._id || i.id,
    _id: i._id || i.id,
    isRead: i.isRead === true,
  };
};

export const inquiryService = {
  /**
   * Fetch all real inquiries from MongoDB Atlas via the backend API.
   * Admin-protected endpoint.
   */
  async list() {
    const res = await apiRequest("/inquiries");
    const list = Array.isArray(res) ? res : res?.data || [];
    return list.map(mapInquiry);
  },

  /**
   * Fetch the current unread inquiry count directly from backend.
   * Admin-protected endpoint.
   */
  async getUnreadCount() {
    try {
      const res = await apiRequest("/inquiries/unread-count");
      return typeof res?.count === "number" ? res.count : 0;
    } catch {
      const list = await this.list();
      return list.filter((i) => !i.isRead).length;
    }
  },

  /**
   * Fetch a single inquiry by ID.
   */
  async getById(id) {
    const res = await apiRequest(`/inquiries/${id}`);
    const data = res && res.data ? res.data : res;
    return mapInquiry(data);
  },

  /**
   * Submit a new customer inquiry to Express backend and save to MongoDB Atlas.
   * Public endpoint.
   */
  async create(payload) {
    const res = await apiRequest("/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = res && res.data ? res.data : res;
    return mapInquiry(data);
  },

  /**
   * Mark an inquiry as viewed/read without altering its contact status.
   * Admin-protected endpoint.
   */
  async markAsRead(id) {
    try {
      const res = await apiRequest(`/inquiries/${id}/read`, {
        method: "PATCH",
      });
      const data = res && res.data ? res.data : res;
      return mapInquiry(data);
    } catch {
      return await this.update(id, { isRead: true });
    }
  },

  /**
   * Update inquiry status or notes in MongoDB Atlas.
   * Admin-protected endpoint.
   */
  async update(id, payload) {
    const res = await apiRequest(`/inquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const data = res && res.data ? res.data : res;
    return mapInquiry(data);
  },

  /**
   * Delete inquiry permanently from MongoDB Atlas.
   * Admin-protected endpoint.
   */
  async remove(id) {
    await apiRequest(`/inquiries/${id}`, { method: "DELETE" });
    return true;
  },
};
