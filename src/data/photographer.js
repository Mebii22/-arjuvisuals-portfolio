import { images } from "./images";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Arjun! I found your portfolio on ArjuVisuals.co and would like to enquire about your photography services.";

export function formatWhatsAppUrl(
  whatsapp = defaultProfile.whatsapp,
  message = DEFAULT_WHATSAPP_MESSAGE
) {
  if (!whatsapp) return null;
  const digits = String(whatsapp).replace(/\D/g, "");
  if (!digits) return null;
  // If 10 digits (e.g. 7736591311), prefix India country code 91
  const fullNumber = digits.length === 10 ? `91${digits}` : digits;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${fullNumber}${query}`;
}

export const defaultProfile = {
  name: "Arjun Murali",
  brandName: "ArjuVisuals.co",
  wordmark: "ARJU VISUALS",
  tagline: "Turning moments into timeless visuals.",
  headline: "Visuals with purpose. Stories that stay.",
  location: "Thrissur, Kerala, India",
  city: "Thrissur",
  education:
    "Currently studying Visual Media Production at Lenor Academy, Malappuram.",
  educationShort: "Visual Media Production · Lenor Academy, Malappuram",
  role: "Freelance commercial photographer, videographer & visual editor",
  shortBio:
    "Arjun creates impactful visuals through photography, cinematic videography, and creative editing — with a focus on clean composition, natural lighting, and authentic storytelling.",
  biography: `I’m Arjun Murali, a freelance commercial photographer, videographer, and visual editor based in Thrissur, Kerala.

I create impactful visuals through photography, cinematic videography, and creative editing, focusing on clean composition, natural lighting, and authentic storytelling.

I’m currently studying Visual Media Production at Lenor Academy, Malappuram, continuously developing my creative perspective and technical skills in photography, cinematography, and visual storytelling.`,
  philosophy:
    "Every frame is an opportunity to communicate something meaningful. The work begins by understanding the story behind the subject — then presenting it with intention, light, and restraint.",
  specialties: [
    "Photography",
    "Cinematography",
    "Visual Editing",
    "Creative Storytelling",
  ],
  // 4 Photos of Arjun (2 on Home, 2 on About)
  // 1. Home - Hero Composition Portrait Cutout
  homeHeroPortrait: images.profile.portraitCutout || "/images/profile/arjun-home-cutout.png",
  portrait: images.profile.portraitCutout || "/images/profile/arjun-home-cutout.png",
  portraitCutout: images.profile.portraitCutout || "/images/profile/arjun-home-cutout.png",
  portraitOriginal: images.profile.portrait || "/images/profile/arjun-portrait.jpg",

  // 2. Home - 'About Arjun' Story Section Portrait
  homeAboutPortrait: images.profile.portraitAlt || "/images/profile/arjun-portrait-alt.jpg",
  portraitAlt: images.profile.portraitAlt || "/images/profile/arjun-portrait-alt.jpg",

  // 3. About Page - Main Editorial Collage Portrait
  aboutMainPortrait: images.profile.aboutPortrait || images.profile.portraitCutout || "/images/profile/arjun-home-cutout.png",
  aboutPortrait: images.profile.aboutPortrait || images.profile.portraitCutout || "/images/profile/arjun-home-cutout.png",

  // 4. About Page - Editorial Polaroid Photo
  aboutPolaroid: images.profile.aboutPolaroid || images.profile.portraitAlt || "/images/profile/arjun-portrait-alt.jpg",
  aboutPolaroidCaption: "Arjun Murali · Studio Candid",
  aboutPolaroidMeta: "Thrissur // Ray-Ban Studio",
  signatureText: "Arjun Murali",
  showSignature: true,
  cover: images.hero.home,
  email: "ArjunvMurali1092004@gmail.com",
  phone: "7736591311",
  whatsapp: "917736591311",
  instagram: "https://www.instagram.com/arjuvisuals.co/",
  instagramHandle: "@Arjuvisuals.co",
  website: "https://arjuvisuals.co",
  socials: [
    {
      name: "Instagram",
      handle: "@Arjuvisuals.co",
      url: "https://www.instagram.com/arjuvisuals.co/",
    },
  ],
};
