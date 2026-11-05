const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Arjun Murali",
      trim: true,
    },
    brandName: {
      type: String,
      default: "ArjuVisuals.co",
      trim: true,
    },
    wordmark: {
      type: String,
      default: "ARJU VISUALS",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Turning moments into timeless visuals.",
      trim: true,
    },
    headline: {
      type: String,
      default: "Visuals with purpose. Stories that stay.",
      trim: true,
    },
    location: {
      type: String,
      default: "Thrissur, Kerala, India",
      trim: true,
    },
    city: {
      type: String,
      default: "Thrissur",
      trim: true,
    },
    education: {
      type: String,
      default: "Currently studying Visual Media Production at Lenor Academy, Malappuram.",
      trim: true,
    },
    educationShort: {
      type: String,
      default: "Visual Media Production · Lenor Academy, Malappuram",
      trim: true,
    },
    role: {
      type: String,
      default: "Freelance commercial photographer, videographer & visual editor",
      trim: true,
    },
    shortBio: {
      type: String,
      default: "Arjun creates impactful visuals through photography, cinematic videography, and creative editing — with a focus on clean composition, natural lighting, and authentic storytelling.",
      trim: true,
    },
    biography: {
      type: String,
      default: `I’m Arjun Murali, a freelance commercial photographer, videographer, and visual editor based in Thrissur, Kerala.\n\nI create impactful visuals through photography, cinematic videography, and creative editing, focusing on clean composition, natural lighting, and authentic storytelling.\n\nI’m currently studying Visual Media Production at Lenor Academy, Malappuram, continuously developing my creative perspective and technical skills in photography, cinematography, and visual storytelling.`,
      trim: true,
    },
    philosophy: {
      type: String,
      default: "Every frame is an opportunity to communicate something meaningful. The work begins by understanding the story behind the subject — then presenting it with intention, light, and restraint.",
      trim: true,
    },
    specialties: {
      type: [String],
      default: ["Photography", "Cinematography", "Visual Editing", "Creative Storytelling"],
    },
    // The 4 Photographer portraits
    homeHeroPortrait: {
      type: String,
      default: "/images/profile/arjun-home-cutout.png",
      trim: true,
    },
    portrait: {
      type: String,
      default: "/images/profile/arjun-home-cutout.png",
      trim: true,
    },
    portraitCutout: {
      type: String,
      default: "/images/profile/arjun-home-cutout.png",
      trim: true,
    },
    portraitOriginal: {
      type: String,
      default: "/images/profile/arjun-portrait.jpg",
      trim: true,
    },
    homeAboutPortrait: {
      type: String,
      default: "/images/profile/arjun-portrait-alt.jpg",
      trim: true,
    },
    portraitAlt: {
      type: String,
      default: "/images/profile/arjun-portrait-alt.jpg",
      trim: true,
    },
    aboutMainPortrait: {
      type: String,
      default: "/images/profile/arjun-home-cutout.png",
      trim: true,
    },
    aboutPortrait: {
      type: String,
      default: "/images/profile/arjun-home-cutout.png",
      trim: true,
    },
    aboutPolaroid: {
      type: String,
      default: "/images/profile/arjun-portrait-alt.jpg",
      trim: true,
    },
    aboutPolaroidCaption: {
      type: String,
      default: "Arjun Murali · Studio Candid",
      trim: true,
    },
    aboutPolaroidMeta: {
      type: String,
      default: "Thrissur // Ray-Ban Studio",
      trim: true,
    },
    signatureText: {
      type: String,
      default: "Arjun Murali",
      trim: true,
    },
    showSignature: {
      type: Boolean,
      default: true,
    },
    cover: {
      type: String,
      default: "/images/hero/arjun-hero-home.jpg",
      trim: true,
    },
    email: {
      type: String,
      default: "ArjunvMurali1092004@gmail.com",
      trim: true,
    },
    phone: {
      type: String,
      default: "7736591311",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "917736591311",
      trim: true,
    },
    instagram: {
      type: String,
      default: "https://www.instagram.com/arjuvisuals.co/",
      trim: true,
    },
    instagramHandle: {
      type: String,
      default: "@Arjuvisuals.co",
      trim: true,
    },
    website: {
      type: String,
      default: "https://arjuvisuals.co",
      trim: true,
    },
    socials: [
      {
        name: { type: String, default: "Instagram" },
        handle: { type: String, default: "@Arjuvisuals.co" },
        url: { type: String, default: "https://www.instagram.com/arjuvisuals.co/" },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;

