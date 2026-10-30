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
    return sessionStorage.getItem(FLAG) === "prototype";
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
};
