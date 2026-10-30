/**
 * Central API configuration.
 * Flip USE_API to true and set VITE_API_URL when the Node/Express
 * backend and Cloudinary uploads are ready.
 */
export const API_CONFIG = {
  USE_API: false,
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
};

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const storage = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("localStorage write failed — data may be too large.", err);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

export const KEYS = {
  projects: "arjuvisuals.projects.v3",
  profile: "arjuvisuals.profile.v3",
  services: "arjuvisuals.services.v4",
  inquiries: "arjuvisuals.inquiries",
};
