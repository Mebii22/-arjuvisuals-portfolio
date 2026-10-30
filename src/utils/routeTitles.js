import { defaultProjects } from "../data/projects";

/**
 * Returns the cinematic camera display title for a given pathname.
 * Handles public routes, dynamic project slugs, and admin routes.
 */
export function getRouteTitle(pathname) {
  if (!pathname || pathname === "/") return "THE FRAME";

  const cleanPath = pathname.split("?")[0].replace(/\/+$/, "") || "/";

  if (cleanPath === "/portfolio") return "SELECTED WORKS";

  // Dynamic portfolio project details
  if (cleanPath.startsWith("/portfolio/")) {
    const slug = cleanPath.replace("/portfolio/", "").split("/")[0];
    if (slug) {
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("av_projects_data") : null;
        const list = stored ? JSON.parse(stored) : defaultProjects;
        const project = (Array.isArray(list) ? list : defaultProjects).find((p) => p.slug === slug);
        if (project && project.title) {
          return project.title.toUpperCase();
        }
      } catch {
        const project = defaultProjects.find((p) => p.slug === slug);
        if (project && project.title) {
          return project.title.toUpperCase();
        }
      }
    }
    return "PROJECT VIEW";
  }

  if (cleanPath === "/about") return "BEHIND THE LENS";
  if (cleanPath === "/services") return "WHAT I CREATE";
  if (cleanPath === "/contact") return "LET'S CONNECT";

  // Admin routes
  if (cleanPath === "/admin/login") return "STUDIO ACCESS";
  if (cleanPath === "/admin" || cleanPath === "/admin/dashboard") return "STUDIO DESK";
  if (cleanPath === "/admin/projects/new") return "NEW PROJECT";
  if (cleanPath.startsWith("/admin/projects/") && cleanPath.endsWith("/edit")) return "EDIT PROJECT";
  if (cleanPath === "/admin/projects") return "PROJECT MANAGEMENT";
  if (cleanPath === "/admin/photographs" || cleanPath === "/admin/photos") return "PHOTOGRAPHS & STILLS";
  if (cleanPath === "/admin/services") return "STUDIO SERVICES";
  if (cleanPath === "/admin/inquiries") return "INQUIRY DESK";
  if (cleanPath === "/admin/profile") return "PROFILE SETTINGS";

  // Fallback for 404 and undefined routes
  return "EXPLORE";
}
