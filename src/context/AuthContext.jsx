import { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => authService.isAuthed());
  const [email, setEmail] = useState(() => authService.email());

  const value = useMemo(
    () => ({
      isAuthed,
      email,
      login: async (creds) => {
        const res = await authService.login(creds);
        setIsAuthed(true);
        setEmail(res.email);
        return res;
      },
      logout: () => {
        authService.logout();
        setIsAuthed(false);
        setEmail("");
      },
    }),
    [isAuthed, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
