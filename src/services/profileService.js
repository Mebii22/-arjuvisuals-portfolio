import { defaultProfile } from "../data/photographer";
import { API_CONFIG, apiRequest, storage, KEYS } from "./api";

const existingProfile = storage.read(KEYS.profile, null);
const hasLegacyProfile =
  existingProfile &&
  typeof existingProfile.portrait === "string" &&
  (existingProfile.portrait.includes("pexels.com") ||
   existingProfile.portrait === "/images/profile/arjun-portrait.jpg");
const needsContactInit =
  existingProfile &&
  (!existingProfile.email || !existingProfile.phone || !existingProfile.whatsapp);

if (!existingProfile || hasLegacyProfile || needsContactInit) {
  const merged = { ...defaultProfile, ...(existingProfile || {}) };
  if (!merged.email) merged.email = defaultProfile.email;
  if (!merged.phone) merged.phone = defaultProfile.phone;
  if (!merged.whatsapp) merged.whatsapp = defaultProfile.whatsapp;
  if (!merged.instagram) merged.instagram = defaultProfile.instagram;
  if (!merged.instagramHandle) merged.instagramHandle = defaultProfile.instagramHandle;
  storage.write(KEYS.profile, merged);
}

export const profileService = {
  async get() {
    if (API_CONFIG.USE_API) return apiRequest("/profile");
    const stored = storage.read(KEYS.profile, defaultProfile);
    return {
      ...defaultProfile,
      ...stored,
      email: stored?.email || defaultProfile.email,
      phone: stored?.phone || defaultProfile.phone,
      whatsapp: stored?.whatsapp || defaultProfile.whatsapp,
      instagram: stored?.instagram || defaultProfile.instagram,
      instagramHandle: stored?.instagramHandle || defaultProfile.instagramHandle,
      location: stored?.location || defaultProfile.location,
      homeHeroPortrait: stored?.homeHeroPortrait || stored?.portraitCutout || stored?.portrait || defaultProfile.homeHeroPortrait,
      homeAboutPortrait: stored?.homeAboutPortrait || stored?.portraitAlt || defaultProfile.homeAboutPortrait,
      aboutMainPortrait: stored?.aboutMainPortrait || stored?.aboutPortrait || defaultProfile.aboutMainPortrait,
      aboutPolaroid: stored?.aboutPolaroid || defaultProfile.aboutPolaroid,
      aboutPolaroidCaption: stored?.aboutPolaroidCaption || defaultProfile.aboutPolaroidCaption,
      aboutPolaroidMeta: stored?.aboutPolaroidMeta || defaultProfile.aboutPolaroidMeta,
    };
  },
  async update(payload) {
    if (API_CONFIG.USE_API) {
      return apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }
    // Cross-sync backwards compatible aliases
    const synced = {
      ...payload,
      portrait: payload.homeHeroPortrait || payload.portrait,
      portraitCutout: payload.homeHeroPortrait || payload.portraitCutout,
      portraitAlt: payload.homeAboutPortrait || payload.portraitAlt,
      aboutPortrait: payload.aboutMainPortrait || payload.aboutPortrait,
    };
    const next = { ...defaultProfile, ...storage.read(KEYS.profile, {}), ...synced };
    storage.write(KEYS.profile, next);
    return next;
  },
};
