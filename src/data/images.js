/**
 * ArjuVisuals.co Central Image Asset Registry
 *
 * All static imagery is organized locally under /images/
 * - Branding: /images/branding/
 * - Hero: /images/hero/
 * - Profile: /images/profile/
 * - Projects: /images/projects/<project-slug>/
 * - Placeholders: /images/placeholders/
 * - Backgrounds: /images/backgrounds/
 */

export const images = {
  branding: {
    logo: "/images/branding/logo.svg",
    logoPng: "/images/branding/logo.png",
    favicon: "/images/branding/favicon.png",
    faviconSvg: "/images/branding/favicon.svg",
  },

  hero: {
    home: "/images/hero/homepage-hero.jpg",
    about: "/images/hero/about-hero.jpg",
    portfolio: "/images/hero/portfolio-hero.jpg",
  },

  profile: {
    portrait: "/images/profile/arjun-portrait.jpg",
    portraitCutout: "/images/profile/arjun-home-cutout.png",
    portraitCutoutWebp: "/images/profile/arjun-home-cutout.webp",
    aboutPortrait: "/images/profile/arjun-about-portrait.png",
    portraitAlt: "/images/profile/arjun-portrait-alt.jpg",
    aboutPolaroid: "/images/profile/arjun-portrait-alt.jpg",
    signature: "/images/profile/arjun-signature.svg",
  },

  decorations: {
    portraitShape: "/images/decorations/portrait-shape.svg",
    cameraSketch: "/images/decorations/camera-sketch.svg",
  },

  software: {
    photoshop: "/images/software/photoshop.svg",
    lightroom: "/images/software/lightroom.svg",
    premierePro: "/images/software/premiere-pro.svg",
    afterEffects: "/images/software/after-effects.svg",
    davinciResolve: "/images/software/davinci-resolve.svg",
    canva: "/images/software/canva.svg",
  },

  services: {
    wedding: "/images/projects/wedding-photography/cover.jpg",
    portrait: "/images/projects/portrait-photography/cover.jpg",
    fashion: "/images/projects/fashion-photography/cover.jpg",
    event: "/images/projects/event-photography/cover.jpg",
    travel: "/images/projects/travel-photography/cover.jpg",
    nature: "/images/projects/nature-photography/cover.jpg",
    product: "/images/projects/product-photography/cover.jpg",
    cinematography: "/images/projects/event-photography/frame-04.jpg",
    editing: "/images/projects/portrait-photography/frame-03.jpg",
  },

  projects: {
    weddingPhotography: {
      cover: "/images/projects/wedding-photography/cover.jpg",
      gallery: [
        "/images/projects/wedding-photography/frame-01.jpg",
        "/images/projects/wedding-photography/frame-02.jpg",
        "/images/projects/wedding-photography/frame-03.jpg",
        "/images/projects/wedding-photography/frame-04.jpg",
        "/images/projects/wedding-photography/frame-05.jpg",
      ],
    },
    portraitPhotography: {
      cover: "/images/projects/portrait-photography/cover.jpg",
      gallery: [
        "/images/projects/portrait-photography/frame-01.jpg",
        "/images/projects/portrait-photography/frame-02.jpg",
        "/images/projects/portrait-photography/frame-03.jpg",
        "/images/projects/portrait-photography/frame-04.jpg",
        "/images/projects/portrait-photography/frame-05.jpg",
      ],
    },
    fashionPhotography: {
      cover: "/images/projects/fashion-photography/cover.jpg",
      gallery: [
        "/images/projects/fashion-photography/frame-01.jpg",
        "/images/projects/fashion-photography/frame-02.jpg",
        "/images/projects/fashion-photography/frame-03.jpg",
        "/images/projects/fashion-photography/frame-04.jpg",
        "/images/projects/fashion-photography/frame-05.jpg",
      ],
    },
    eventPhotography: {
      cover: "/images/projects/event-photography/cover.jpg",
      gallery: [
        "/images/projects/event-photography/frame-01.jpg",
        "/images/projects/event-photography/frame-02.jpg",
        "/images/projects/event-photography/frame-03.jpg",
        "/images/projects/event-photography/frame-04.jpg",
        "/images/projects/event-photography/frame-05.jpg",
      ],
    },
    travelPhotography: {
      cover: "/images/projects/travel-photography/cover.jpg",
      gallery: [
        "/images/projects/travel-photography/frame-01.jpg",
        "/images/projects/travel-photography/frame-02.jpg",
        "/images/projects/travel-photography/frame-03.jpg",
        "/images/projects/travel-photography/frame-04.jpg",
        "/images/projects/travel-photography/frame-05.jpg",
      ],
    },
    naturePhotography: {
      cover: "/images/projects/nature-photography/cover.jpg",
      gallery: [
        "/images/projects/nature-photography/frame-01.jpg",
        "/images/projects/nature-photography/frame-02.jpg",
        "/images/projects/nature-photography/frame-03.jpg",
        "/images/projects/nature-photography/frame-04.jpg",
        "/images/projects/nature-photography/frame-05.jpg",
      ],
    },
    productPhotography: {
      cover: "/images/projects/product-photography/cover.jpg",
      gallery: [
        "/images/projects/product-photography/frame-01.jpg",
        "/images/projects/product-photography/frame-02.jpg",
        "/images/projects/product-photography/frame-03.jpg",
        "/images/projects/product-photography/frame-04.jpg",
        "/images/projects/product-photography/frame-05.jpg",
      ],
    },
    // Backwards-compatible aliases
    vowsInQuietLight: {
      cover: "/images/projects/wedding-photography/cover.jpg",
      gallery: [
        "/images/projects/wedding-photography/frame-01.jpg",
        "/images/projects/wedding-photography/frame-02.jpg",
        "/images/projects/wedding-photography/frame-03.jpg",
        "/images/projects/wedding-photography/frame-04.jpg",
        "/images/projects/wedding-photography/frame-05.jpg",
      ],
    },
    afterLight: {
      cover: "/images/projects/portrait-photography/cover.jpg",
      gallery: [
        "/images/projects/portrait-photography/frame-01.jpg",
        "/images/projects/portrait-photography/frame-02.jpg",
        "/images/projects/portrait-photography/frame-03.jpg",
        "/images/projects/portrait-photography/frame-04.jpg",
        "/images/projects/portrait-photography/frame-05.jpg",
      ],
    },
    silkAndShadow: {
      cover: "/images/projects/fashion-photography/cover.jpg",
      gallery: [
        "/images/projects/fashion-photography/frame-01.jpg",
        "/images/projects/fashion-photography/frame-02.jpg",
        "/images/projects/fashion-photography/frame-03.jpg",
        "/images/projects/fashion-photography/frame-04.jpg",
        "/images/projects/fashion-photography/frame-05.jpg",
      ],
    },
    crowdAndColour: {
      cover: "/images/projects/event-photography/cover.jpg",
      gallery: [
        "/images/projects/event-photography/frame-01.jpg",
        "/images/projects/event-photography/frame-02.jpg",
        "/images/projects/event-photography/frame-03.jpg",
        "/images/projects/event-photography/frame-04.jpg",
        "/images/projects/event-photography/frame-05.jpg",
      ],
    },
    farFromHere: {
      cover: "/images/projects/travel-photography/cover.jpg",
      gallery: [
        "/images/projects/travel-photography/frame-01.jpg",
        "/images/projects/travel-photography/frame-02.jpg",
        "/images/projects/travel-photography/frame-03.jpg",
        "/images/projects/travel-photography/frame-04.jpg",
        "/images/projects/travel-photography/frame-05.jpg",
      ],
    },
    greenHour: {
      cover: "/images/projects/nature-photography/cover.jpg",
      gallery: [
        "/images/projects/nature-photography/frame-01.jpg",
        "/images/projects/nature-photography/frame-02.jpg",
        "/images/projects/nature-photography/frame-03.jpg",
        "/images/projects/nature-photography/frame-04.jpg",
        "/images/projects/nature-photography/frame-05.jpg",
      ],
    },
    stillObject: {
      cover: "/images/projects/product-photography/cover.jpg",
      gallery: [
        "/images/projects/product-photography/frame-01.jpg",
        "/images/projects/product-photography/frame-02.jpg",
        "/images/projects/product-photography/frame-03.jpg",
        "/images/projects/product-photography/frame-04.jpg",
        "/images/projects/product-photography/frame-05.jpg",
      ],
    },
  },

  placeholders: {
    default: "/images/placeholders/image-placeholder.svg",
  },

  backgrounds: {
    texture: "/images/backgrounds/texture.jpg",
  },
};

/**
 * Backward-compatible mapping for existing component references.
 * Resolves legacy IMG keys to canonical local project & profile assets.
 */
export const IMG = {
  hero: images.hero.home,
  heroPortrait: images.hero.about,
  arjun: images.profile.portraitCutout || images.profile.portrait,
  arjunCutout: images.profile.portraitCutout,
  arjunOriginal: images.profile.portrait,
  arjunAbout: images.profile.aboutPortrait,
  arjunAlt: images.profile.portraitAlt,
  signature: images.profile.signature,
  camera: images.projects.stillObject.gallery[0],
  silhouette: images.hero.portfolio,

  // Canonical category cover and gallery frame mappings (including frame-01 gallery[0])
  weddingCover: images.projects.weddingPhotography.cover,
  weddingFrame1: images.projects.weddingPhotography.gallery[0],
  weddingFrame2: images.projects.weddingPhotography.gallery[1],
  weddingFrame3: images.projects.weddingPhotography.gallery[2],
  weddingFrame4: images.projects.weddingPhotography.gallery[3],
  weddingFrame5: images.projects.weddingPhotography.gallery[4],
  wedding1: images.projects.weddingPhotography.cover,
  wedding2: images.projects.weddingPhotography.gallery[0], // frame-01.jpg
  wedding3: images.projects.weddingPhotography.gallery[1],
  wedding4: images.projects.weddingPhotography.gallery[2],
  wedding5: images.projects.weddingPhotography.gallery[3],
  wedding6: images.projects.weddingPhotography.gallery[4],

  portraitCover: images.projects.portraitPhotography.cover,
  portraitFrame1: images.projects.portraitPhotography.gallery[0],
  portraitFrame2: images.projects.portraitPhotography.gallery[1],
  portraitFrame3: images.projects.portraitPhotography.gallery[2],
  portraitFrame4: images.projects.portraitPhotography.gallery[3],
  portraitFrame5: images.projects.portraitPhotography.gallery[4],
  portrait1: images.projects.portraitPhotography.cover,
  portrait2: images.projects.portraitPhotography.gallery[0], // frame-01.jpg
  portrait3: images.projects.portraitPhotography.gallery[1],
  portrait4: images.projects.portraitPhotography.gallery[2],
  portrait5: images.projects.portraitPhotography.gallery[3],
  portrait6: images.projects.portraitPhotography.gallery[4],
  portrait7: images.projects.portraitPhotography.cover,
  portrait8: images.projects.portraitPhotography.gallery[1],
  portrait9: images.projects.portraitPhotography.gallery[2],
  portrait10: images.projects.portraitPhotography.gallery[3],

  fashionCover: images.projects.fashionPhotography.cover,
  fashionFrame1: images.projects.fashionPhotography.gallery[0],
  fashionFrame2: images.projects.fashionPhotography.gallery[1],
  fashionFrame3: images.projects.fashionPhotography.gallery[2],
  fashionFrame4: images.projects.fashionPhotography.gallery[3],
  fashionFrame5: images.projects.fashionPhotography.gallery[4],
  fashion1: images.projects.fashionPhotography.cover,
  fashion2: images.projects.fashionPhotography.gallery[0], // frame-01.jpg
  fashion3: images.projects.fashionPhotography.gallery[1],
  fashion4: images.projects.fashionPhotography.gallery[2],
  fashion5: images.projects.fashionPhotography.gallery[3],
  fashion6: images.projects.fashionPhotography.gallery[4],

  eventCover: images.projects.eventPhotography.cover,
  eventFrame1: images.projects.eventPhotography.gallery[0],
  eventFrame2: images.projects.eventPhotography.gallery[1],
  eventFrame3: images.projects.eventPhotography.gallery[2],
  eventFrame4: images.projects.eventPhotography.gallery[3],
  eventFrame5: images.projects.eventPhotography.gallery[4],
  event1: images.projects.eventPhotography.cover,
  event2: images.projects.eventPhotography.gallery[0], // frame-01.jpg
  event3: images.projects.eventPhotography.gallery[1],
  event4: images.projects.eventPhotography.gallery[2],
  event5: images.projects.eventPhotography.gallery[3],
  event6: images.projects.eventPhotography.gallery[4],

  travelCover: images.projects.travelPhotography.cover,
  travelFrame1: images.projects.travelPhotography.gallery[0],
  travelFrame2: images.projects.travelPhotography.gallery[1],
  travelFrame3: images.projects.travelPhotography.gallery[2],
  travelFrame4: images.projects.travelPhotography.gallery[3],
  travelFrame5: images.projects.travelPhotography.gallery[4],
  travel1: images.projects.travelPhotography.cover,
  travel2: images.projects.travelPhotography.gallery[0], // frame-01.jpg
  travel3: images.projects.travelPhotography.gallery[1],
  travel4: images.projects.travelPhotography.gallery[2],
  kerala1: images.projects.travelPhotography.gallery[3],
  travel5: images.projects.travelPhotography.gallery[4],

  natureCover: images.projects.naturePhotography.cover,
  natureFrame1: images.projects.naturePhotography.gallery[0],
  natureFrame2: images.projects.naturePhotography.gallery[1],
  natureFrame3: images.projects.naturePhotography.gallery[2],
  natureFrame4: images.projects.naturePhotography.gallery[3],
  natureFrame5: images.projects.naturePhotography.gallery[4],
  nature1: images.projects.naturePhotography.cover,
  nature2: images.projects.naturePhotography.gallery[0], // frame-01.jpg
  nature3: images.projects.naturePhotography.gallery[1],
  nature4: images.projects.naturePhotography.gallery[2],
  nature5: images.projects.naturePhotography.gallery[3],
  kerala3: images.projects.naturePhotography.gallery[4],

  productCover: images.projects.productPhotography.cover,
  productFrame1: images.projects.productPhotography.gallery[0],
  productFrame2: images.projects.productPhotography.gallery[1],
  productFrame3: images.projects.productPhotography.gallery[2],
  productFrame4: images.projects.productPhotography.gallery[3],
  productFrame5: images.projects.productPhotography.gallery[4],
  product1: images.projects.productPhotography.cover,
  product2: images.projects.productPhotography.gallery[0], // frame-01.jpg
  product3: images.projects.productPhotography.gallery[1],
  product4: images.projects.productPhotography.gallery[2],
  product5: images.projects.productPhotography.gallery[3],
  product6: images.projects.productPhotography.gallery[4],
};

/**
 * Pexels CDN helper kept for backward compatibility if ever queried by admin mocks.
 */
export const pexels = (id, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
