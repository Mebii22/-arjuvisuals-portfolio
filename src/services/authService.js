import { API_CONFIG, apiRequest } from "./api";

/**
 * FRONTEND PROTOTYPE ONLY.
 * Not real authentication. sessionStorage is not security.
 * Future Express route: POST /api/auth/login
 * Only Arjun Murali’s administrator account will be accepted by the server.
 */
const FLAG = "arjuvisuals.adminSession";
const EMAIL_KEY = "arjuvisuals.adminEmail";

export const authService = {
  isAuthed() {
    return Boolean(sessionStorage.getItem(FLAG));
  },

  getToken() {
    return sessionStorage.getItem(FLAG) || "";
  },

  async login({ email, password }) {
    const cleanEmail = String(email || "").trim();
    if (!cleanEmail.includes("@")) {
      throw new Error("Enter a valid email address.");
    }
    if (!password) {
      throw new Error("Enter a password.");
    }

    if (API_CONFIG.USE_API) {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      sessionStorage.setItem(FLAG, data.token || "session");
      sessionStorage.setItem(EMAIL_KEY, cleanEmail);
      return { email: cleanEmail, demo: false };
    }

    sessionStorage.setItem(FLAG, "prototype");
    sessionStorage.setItem(EMAIL_KEY, cleanEmail);
    return { email: cleanEmail, demo: true };
  },

  logout() {
    sessionStorage.removeItem(FLAG);
    sessionStorage.removeItem(EMAIL_KEY);
  },

  email() {
    return sessionStorage.getItem(EMAIL_KEY) || "";
  },

  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    if (!currentPassword) {
      throw new Error("Enter your current password.");
    }
    if (!newPassword || newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters.");
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      throw new Error("New passwords do not match.");
    }

    if (API_CONFIG.USE_API) {
      const res = await apiRequest("/auth/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      return res;
    }
    return { success: true, message: "Password updated." };
  },
};
