/**
 * Central API configuration.
 * Flip USE_API to true and set VITE_API_URL when the Node/Express
 * backend and Cloudinary uploads are ready.
 */
export const API_CONFIG = {
  USE_API: true,
  BASE_URL: (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/+$/, ""),
};

export async function apiRequest(path, options = {}) {
  const token = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("arjuvisuals.adminSession") : null;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && token !== "prototype" && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && data.message) errorMsg = data.message;
    } catch {
      // Keep default error message
    }
    const err = new Error(errorMsg);
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
