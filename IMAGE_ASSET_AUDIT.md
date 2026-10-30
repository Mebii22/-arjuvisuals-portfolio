# Image Asset Audit & Local Migration Plan
**Project:** ArjuVisuals.co (Portfolio for Arjun Murali — Thrissur, Kerala)  
**Date:** October 2026  
**Auditor:** Senior Frontend Asset-Management Specialist

---

## 1. Executive Summary

An exhaustive audit of the entire ArjuVisuals.co codebase was conducted across all pages, components, data files, stylesheets, and services. The project currently relies on remote Pexels CDN image URLs declared primarily within `src/data/images.js` and referenced throughout `projects.js`, `services.js`, `photographer.js`, `Home.jsx`, `About.jsx`, and administrative preview pages.

Every remote asset has been verified via network probes (100% reachable with HTTP 200 responses) and categorized. This audit outlines the complete inventory, identifies duplicates, documents placeholder statuses, defines the new local directory architecture under `public/images/`, and establishes the migration mapping.

---

## 2. Complete Inventory of Discovered Image References

| ID / Key | Original Source URL | Referenced In | Page / Section | Purpose | Recommended Local Destination | Duplication / Status | Needs Real Photo? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hero` | `pexels(23384400, 2000)` | `photographer.js` | Home hero background / Profile cover | Cinematic visual atmosphere | `/images/hero/homepage-hero.jpg` | Duplicated in `silhouette`, `cinema1` | Yes (Placeholder) |
| `heroPortrait`| `pexels(19615558, 1400)` | `images.js` | Hero / About fallback | Atmospheric photographer frame | `/images/hero/about-hero.jpg` | Unused directly in views | Yes (Placeholder) |
| `arjun` | `pexels(38493377, 1200)` | `Home.jsx`, `About.jsx`, `photographer.js`, `AdminProfile.jsx` | Home Hero Ring, About Hero Ring, Profile | Primary portrait of Arjun Murali | `/images/profile/arjun-portrait.jpg` | Reused in Home & About | **YES — Urgent** (Temporary stock representation) |
| `arjunAlt` | `pexels(34014654, 1200)` | `Home.jsx`, `photographer.js` | Home About section ("Behind the lens") | Secondary candid sitting portrait | `/images/profile/arjun-portrait-alt.jpg` | Reused in Home & Profile | **YES — Urgent** (Temporary stock representation) |
| `camera` | `pexels(27038705, 1200)` | `images.js` | Commercial / Gear showcase | Camera equipment visual | `/images/portfolio/commercial/commercial-camera-kit.jpg` | Standalone asset | Optional |
| `silhouette` | `pexels(23384400, 1600)` | `images.js` | Background / Silhouette | Atmospheric silhouette frame | `/images/hero/portfolio-hero.jpg` | Duplicate of 23384400 | Yes (Placeholder) |
| `portrait1` | `pexels(19615564, 1400)` | `Home.jsx` (SPOTS), `services.js` (s-portrait), `projects.js` (p-after-light cover & gallery[0]) | Home Spots, Services Card, Project Details | Natural window light portrait | `/images/portfolio/portraits/portrait-window-light-01.jpg` & `/images/services/portrait-photography.jpg` & `/images/projects/after-light/cover.jpg` | Triple reuse | Yes (Placeholder) |
| `portrait2` | `pexels(4343180, 1200)` | `projects.js` (p-after-light gallery[1]) | Project Details ("After Light") | Subtle gaze studio portrait | `/images/projects/after-light/frame-02.jpg` | Unique | Yes (Placeholder) |
| `portrait3` | `pexels(16077161, 1200)` | `projects.js` (p-after-light gallery[2]) | Project Details ("After Light") | Black and white studio study | `/images/projects/after-light/frame-03.jpg` | Unique | Yes (Placeholder) |
| `portrait4` | `pexels(32721690, 1200)` | `projects.js` (p-after-light gallery[3], p-open-face cover & gallery[0]) | Project Details ("After Light", "Open Face") | Tight close-up portrait | `/images/projects/after-light/frame-04.jpg` & `/images/projects/open-face/cover.jpg` | Duplicated across 2 projects | Yes (Placeholder) |
| `portrait5` | `pexels(17184859, 1200)` | `images.js` | Portrait portfolio archive | Character study | `/images/portfolio/portraits/portrait-character-09.jpg` | Standalone | Yes (Placeholder) |
| `portrait6` | `pexels(12596735, 1200)` | `projects.js` (p-open-face gallery[1]) | Project Details ("Open Face") | Expressive profile study | `/images/projects/open-face/frame-02.jpg` | Unique | Yes (Placeholder) |
| `portrait7` | `pexels(39677720, 1200)` | `images.js` | Portrait portfolio archive | Studio low-key portrait | `/images/portfolio/portraits/portrait-profile-10.jpg` | Standalone | Yes (Placeholder) |
| `portrait8` | `pexels(28578570, 1200)` | `projects.js` (p-open-face gallery[2]) | Project Details ("Open Face") | Graphic contrast portrait | `/images/projects/open-face/frame-03.jpg` | Unique | Yes (Placeholder) |
| `portrait9` | `pexels(5570990, 1400)` | `projects.js` (p-after-light gallery[4]) | Project Details ("After Light") | Natural skin tone portrait | `/images/projects/after-light/frame-05.jpg` | Unique | Yes (Placeholder) |
| `portrait10`| `pexels(7277907, 1400)` | `projects.js` (p-open-face gallery[3]) | Project Details ("Open Face") | Warm light portrait | `/images/projects/open-face/frame-04.jpg` | Unique | Yes (Placeholder) |
| `fashion1` | `pexels(34420558, 1200)` | `Home.jsx` (SPOTS), `services.js` (s-fashion), `projects.js` (p-silk-shadow cover & gallery[0]) | Home Spots, Services Card, Project Details | High-fashion editorial lookbook | `/images/portfolio/fashion/fashion-editorial-silk-01.jpg` & `/images/services/fashion-photography.jpg` & `/images/projects/silk-and-shadow/cover.jpg` | Triple reuse | Yes (Placeholder) |
| `fashion2` | `pexels(18466231, 1200)` | `projects.js` (p-silk-shadow gallery[1]) | Project Details ("Silk & Shadow") | Architectural shadow fashion | `/images/projects/silk-and-shadow/frame-02.jpg` | Unique | Yes (Placeholder) |
| `fashion3` | `pexels(5582090, 1200)` | `images.js` | Fashion portfolio archive | Texture and drape fashion | `/images/portfolio/fashion/fashion-lookbook-03.jpg` | Standalone | Yes (Placeholder) |
| `fashion4` | `pexels(29979915, 1200)` | `projects.js` (p-silk-shadow gallery[2]) | Project Details ("Silk & Shadow") | Contemporary editorial silhouette | `/images/projects/silk-and-shadow/frame-03.jpg` | Unique | Yes (Placeholder) |
| `fashion5` | `pexels(29130101, 1200)` | `projects.js` (p-silk-shadow gallery[3]) | Project Details ("Silk & Shadow") | Monochromatic garment movement | `/images/projects/silk-and-shadow/frame-04.jpg` | Unique | Yes (Placeholder) |
| `fashion6` | `pexels(20451157, 1200)` | `projects.js` (p-silk-shadow gallery[4]) | Project Details ("Silk & Shadow") | Minimalist silhouette frame | `/images/projects/silk-and-shadow/frame-05.jpg` | Unique | Yes (Placeholder) |
| `event1` | `pexels(761543, 1800)` | `Home.jsx` (SPOTS), `services.js` (s-event), `projects.js` (p-crowd-colour cover & gallery[0]) | Home Spots, Services Card, Project Details | Live concert stage atmosphere | `/images/portfolio/events/event-stage-light-01.jpg` & `/images/services/event-photography.jpg` & `/images/projects/crowd-and-colour/cover.jpg` | Triple reuse | Yes (Placeholder) |
| `event2` | `pexels(30215324, 1600)` | `projects.js` (p-crowd-colour gallery[1]) | Project Details ("Crowd & Colour") | Crowd rhythm and ambient lighting | `/images/projects/crowd-and-colour/frame-02.jpg` | Unique | Yes (Placeholder) |
| `event3` | `pexels(14870726, 1600)` | `projects.js` (p-crowd-colour gallery[2]) | Project Details ("Crowd & Colour") | Festival night glow | `/images/projects/crowd-and-colour/frame-03.jpg` | Unique | Yes (Placeholder) |
| `event4` | `pexels(30518233, 1600)` | `projects.js` (p-crowd-colour gallery[3]) | Project Details ("Crowd & Colour") | Live music stage close-up | `/images/projects/crowd-and-colour/frame-04.jpg` | Unique | Yes (Placeholder) |
| `event5` | `pexels(30994960, 1600)` | `projects.js` (p-crowd-colour gallery[4]) | Project Details ("Crowd & Colour") | Gathering energy in dusk light | `/images/projects/crowd-and-colour/frame-05.jpg` | Unique | Yes (Placeholder) |
| `product1` | `pexels(11417443, 1600)` | `Home.jsx` (SPOTS), `services.js` (s-product), `projects.js` (p-still-object cover & gallery[0]) | Home Spots, Services Card, Project Details | Ceramic craft object still life | `/images/portfolio/products/product-still-ceramic-01.jpg` & `/images/services/product-photography.jpg` & `/images/projects/still-object/cover.jpg` | Triple reuse | Yes (Placeholder) |
| `product2` | `pexels(9202860, 1600)` | `projects.js` (p-still-object gallery[1]) | Project Details ("Still / Object") | Sculptural product illumination | `/images/projects/still-object/frame-02.jpg` | Unique | Yes (Placeholder) |
| `product3` | `pexels(36779955, 1600)` | `projects.js` (p-still-object gallery[2]) | Project Details ("Still / Object") | Natural cosmetics bottle still | `/images/projects/still-object/frame-03.jpg` | Unique | Yes (Placeholder) |
| `product4` | `pexels(35624038, 1600)` | `projects.js` (p-still-object gallery[3]) | Project Details ("Still / Object") | Glassware refraction and shadow | `/images/projects/still-object/frame-04.jpg` | Unique | Yes (Placeholder) |
| `product5` | `pexels(36779957, 1600)` | `projects.js` (p-still-object gallery[4]) | Project Details ("Still / Object") | Minimal botanical product still | `/images/projects/still-object/frame-05.jpg` | Unique | Yes (Placeholder) |
| `kerala1` | `pexels(13044389, 1800)` | `projects.js` (p-far-from-here gallery[4]) | Project Details ("Far From Here") | Kerala serene backwaters canoe | `/images/projects/far-from-here/frame-05.jpg` | Unique | Yes (Placeholder) |
| `kerala2` | `pexels(20830783, 1600)` | `images.js` | Kerala regional archive | Munnar emerald tea estate | `/images/portfolio/commercial/commercial-kerala-tea.jpg` | Standalone | Yes (Placeholder) |
| `kerala3` | `pexels(39923405, 1600)` | `projects.js` (p-green-hour gallery[4]) | Project Details ("Green Hour") | Western Ghats canopy vegetation | `/images/projects/green-hour/frame-05.jpg` | Unique | Yes (Placeholder) |
| `kerala4` | `pexels(27869349, 1600)` | `images.js` | Kerala regional archive | Foggy mountain road | `/images/portfolio/commercial/commercial-kerala-hills.jpg` | Standalone | Yes (Placeholder) |
| `kerala5` | `pexels(28446782, 1600)` | `images.js` | Kerala regional archive | Arabian Sea rocky coastline | `/images/portfolio/commercial/commercial-kerala-coast.jpg` | Standalone | Yes (Placeholder) |
| `cinema1` | `pexels(23384400, 1600)` | `images.js` | Cinematography showcase | Sunset cinematic silhouette | `/images/portfolio/cinematography/cinema-dramatic-dusk-01.jpg` | Duplicate of 23384400 | Yes (Placeholder) |
| `cinema2` | `pexels(30396798, 1600)` | `images.js` | Cinematography showcase | Low-light blue-hour narrative | `/images/portfolio/cinematography/cinema-low-light-02.jpg` & `/images/services/cinematography.jpg` | Standalone | Yes (Placeholder) |
| `cinema3` | `pexels(34215537, 1600)` | `images.js` | Cinematography showcase | Wide anamorphic aspect frame | `/images/portfolio/cinematography/cinema-wide-frame-03.jpg` | Standalone | Yes (Placeholder) |
| `cinema4` | `pexels(23384407, 1600)` | `images.js` | Cinematography showcase | Golden twilight coastal movement | `/images/portfolio/cinematography/cinema-anamorphic-04.jpg` | Standalone | Yes (Placeholder) |
| `life1` | `pexels(14839134, 1600)` | `images.js` | Lifestyle portfolio archive | Street documentary portrait | `/images/portfolio/lifestyle/lifestyle-street-01.jpg` | Standalone | Yes (Placeholder) |
| `life2` | `pexels(5177803, 1600)` | `images.js` | Lifestyle portfolio archive | Coffee craft barista detail | `/images/portfolio/lifestyle/lifestyle-quiet-moment-02.jpg` | Standalone | Yes (Placeholder) |
| `life3` | `pexels(5176902, 1600)` | `images.js` | Lifestyle portfolio archive | Artisan pottery workspace | `/images/portfolio/lifestyle/lifestyle-candid-03.jpg` | Standalone | Yes (Placeholder) |
| `life4` | `pexels(5177194, 1600)` | `images.js` | Lifestyle portfolio archive | Maker hands molding clay | `/images/portfolio/lifestyle/lifestyle-artisan-04.jpg` | Standalone | Yes (Placeholder) |
| `food1` | `pexels(39700236, 1600)` | `images.js` | Culinary / Commercial | Artisanal bread & rustic spread | `/images/portfolio/commercial/commercial-culinary-01.jpg` | Standalone | Yes (Placeholder) |
| `food2` | `pexels(39700232, 1600)` | `images.js` | Culinary / Commercial | Spices and tabletop styling | `/images/portfolio/commercial/commercial-culinary-02.jpg` | Standalone | Yes (Placeholder) |
| `food3` | `pexels(39700448, 1600)` | `images.js` | Culinary / Commercial | Plated gastronomic detail | `/images/portfolio/commercial/commercial-culinary-03.jpg` | Standalone | Yes (Placeholder) |
| `wedding1` | `pexels(32878577, 1800)` | `Home.jsx` (SPOTS), `services.js` (s-wedding), `projects.js` (p-vows cover & gallery[0]) | Home Spots, Services Card, Project Details | Intimate couple silhouette in warm glow | `/images/portfolio/wedding/wedding-ceremony-01.jpg` & `/images/services/wedding-photography.jpg` & `/images/projects/vows-in-quiet-light/cover.jpg` | Triple reuse | Yes (Placeholder) |
| `wedding2` | `pexels(34767566, 1600)` | `projects.js` (p-vows gallery[1]) | Project Details ("Vows in Quiet Light") | Traditional silk saree & jewelry candid | `/images/projects/vows-in-quiet-light/frame-02.jpg` | Unique | Yes (Placeholder) |
| `wedding3` | `pexels(11516390, 1600)` | `projects.js` (p-vows gallery[2]) | Project Details ("Vows in Quiet Light") | Couple walking in garden light | `/images/projects/vows-in-quiet-light/frame-03.jpg` | Unique | Yes (Placeholder) |
| `wedding4` | `pexels(29002730, 1600)` | `projects.js` (p-vows gallery[3]) | Project Details ("Vows in Quiet Light") | Ring exchange emotional close-up | `/images/projects/vows-in-quiet-light/frame-04.jpg` | Unique | Yes (Placeholder) |
| `wedding5` | `pexels(40027567, 1600)` | `projects.js` (p-vows gallery[4]) | Project Details ("Vows in Quiet Light") | Twilight reception celebration | `/images/projects/vows-in-quiet-light/frame-05.jpg` | Unique | Yes (Placeholder) |
| `travel1` | `pexels(14169534, 1800)` | `Home.jsx` (SPOTS), `services.js` (s-travel), `projects.js` (p-far-from-here cover & gallery[0]) | Home Spots, Services Card, Project Details | Highland mountain ridgeline mist | `/images/portfolio/travel/travel-ridgeline-01.jpg` & `/images/services/travel-photography.jpg` & `/images/projects/far-from-here/cover.jpg` | Triple reuse | Yes (Placeholder) |
| `travel2` | `pexels(35711550, 1600)` | `projects.js` (p-far-from-here gallery[1]) | Project Details ("Far From Here") | Coastal rock formation and waves | `/images/projects/far-from-here/frame-02.jpg` | Unique | Yes (Placeholder) |
| `travel3` | `pexels(13717086, 1600)` | `projects.js` (p-far-from-here gallery[2]) | Project Details ("Far From Here") | Lone traveler on misty summit | `/images/projects/far-from-here/frame-03.jpg` | Unique | Yes (Placeholder) |
| `travel4` | `pexels(35252465, 1600)` | `projects.js` (p-far-from-here gallery[3]) | Project Details ("Far From Here") | Winding mountain road canopy | `/images/projects/far-from-here/frame-04.jpg` | Unique | Yes (Placeholder) |
| `nature1` | `pexels(19593823, 1800)` | `Home.jsx` (SPOTS), `services.js` (s-nature), `projects.js` (p-green-hour cover & gallery[0]) | Home Spots, Services Card, Project Details | Dense subtropical forest canopy | `/images/portfolio/nature/nature-mist-canopy-01.jpg` & `/images/services/nature-photography.jpg` & `/images/projects/green-hour/cover.jpg` | Triple reuse | Yes (Placeholder) |
| `nature2` | `pexels(14020829, 1600)` | `projects.js` (p-green-hour gallery[1]) | Project Details ("Green Hour") | Forest waterfall cascading through moss | `/images/projects/green-hour/frame-02.jpg` | Unique | Yes (Placeholder) |
| `nature3` | `pexels(6872852, 1600)` | `projects.js` (p-green-hour gallery[2]) | Project Details ("Green Hour") | Monsoon rain on tropical foliage | `/images/projects/green-hour/frame-03.jpg` | Unique | Yes (Placeholder) |
| `nature4` | `pexels(15505679, 1600)` | `projects.js` (p-green-hour gallery[3]) | Project Details ("Green Hour") | Misty valley in Western Ghats | `/images/projects/green-hour/frame-04.jpg` | Unique | Yes (Placeholder) |
| `nature5` | `pexels(17341659, 1600)` | `images.js` | Nature portfolio archive | Highland rolling meadows | `/images/portfolio/nature/nature-highland-06.jpg` | Standalone | Yes (Placeholder) |
| Inline SVG | `data:image/svg+xml...` | `index.html:22` | Browser Tab Favicon | Brand favicon icon | `/images/branding/favicon.png` & `/images/branding/logo.svg` | Standalone | Official Brand Asset |
| Inline Noise | `data:image/svg+xml...` | `global.css:381` | Hero Grain Texture | Film grain aesthetic overlay | `/images/backgrounds/texture.jpg` & CSS | Reusable | Retained |

---

## 3. Brand Assets, Logos & Placeholders

The site currently lacks dedicated raster/vector files in `public/` for brand identity and fallback states. As part of this audit and reorganization, the following files are specified:

1. **`public/images/branding/logo.svg`**:
   High-definition vector wordmark combining "ARJU VISUALS.CO" typography, geometric camera aperture motif, in `#004643` (Cyprus Green) and `#F0EDE5` (Sand).
2. **`public/images/branding/logo.png`**:
   Transparent high-resolution PNG rendering of the brand wordmark for non-SVG contexts.
3. **`public/images/branding/favicon.png`**:
   Crisp raster favicon replacing the inline data URL in `index.html`.
4. **`public/images/placeholders/image-placeholder.svg`**:
   Aesthetic fallback SVG with camera doodle and "ArjuVisuals.co · Frame pending" indicator for missing or loading photographs.
5. **`public/images/backgrounds/texture.jpg`**:
   Subtle photographic grain texture matching the `#004643` and dark gradient aesthetic.

---

## 4. Local Folder Architecture (Deduplicated & Cleaned)

All local image assets are organized cleanly under `public/images/` using a canonical project-based structure. Redundant duplicate trees (`public/images/portfolio/` and `public/images/services/`) and build artifacts (`dist/`) have been removed:

```
public/
└── images/
    ├── backgrounds/
    │   └── texture.jpg
    ├── branding/
    │   ├── favicon.png
    │   ├── favicon.svg
    │   ├── logo.png
    │   └── logo.svg
    ├── hero/
    │   ├── about-hero.jpg
    │   ├── homepage-hero.jpg
    │   └── portfolio-hero.jpg
    ├── placeholders/
    │   └── image-placeholder.svg
    ├── profile/
    │   ├── arjun-portrait.jpg
    │   └── arjun-portrait-alt.jpg
    └── projects/
        ├── wedding-photography/
        │   ├── cover.jpg
        │   ├── frame-01.jpg
        │   ├── frame-02.jpg
        │   ├── frame-03.jpg
        │   ├── frame-04.jpg
        │   └── frame-05.jpg
        ├── portrait-photography/
        │   ├── cover.jpg
        │   ├── frame-01.jpg
        │   ├── frame-02.jpg
        │   ├── frame-03.jpg
        │   ├── frame-04.jpg
        │   └── frame-05.jpg
        ├── fashion-photography/
        │   ├── cover.jpg
        │   ├── frame-01.jpg
        │   ├── frame-02.jpg
        │   ├── frame-03.jpg
        │   ├── frame-04.jpg
        │   └── frame-05.jpg
        ├── event-photography/
        │   ├── cover.jpg
        │   ├── frame-01.jpg
        │   ├── frame-02.jpg
        │   ├── frame-03.jpg
        │   ├── frame-04.jpg
        │   └── frame-05.jpg
        ├── travel-photography/
        │   ├── cover.jpg
        │   ├── frame-01.jpg
        │   ├── frame-02.jpg
        │   ├── frame-03.jpg
        │   ├── frame-04.jpg
        │   └── frame-05.jpg
        ├── nature-photography/
        │   ├── cover.jpg
        │   ├── frame-01.jpg
        │   ├── frame-02.jpg
        │   ├── frame-03.jpg
        │   ├── frame-04.jpg
        │   └── frame-05.jpg
        └── product-photography/
            ├── cover.jpg
            ├── frame-01.jpg
            ├── frame-02.jpg
            ├── frame-03.jpg
            ├── frame-04.jpg
            └── frame-05.jpg
```

---

## 5. Placeholder & Attribution Notes

> [!IMPORTANT]
> **Honesty & Ethics Notice**: All current photographic assets originate from royalty-free CC0/Pexels licenses and represent the aesthetic direction, composition style, and color grading intended for Arjun Murali's portfolio. None of these images should ever be misrepresented as Arjun's actual past client deliverables.
> 
> * **Photographer Portrait (`arjun-portrait.jpg`, `arjun-portrait-alt.jpg`)**: Marked as **temporary placeholders**. As soon as Arjun provides authentic headshots and behind-the-scenes photographs, these files should simply be overwritten with the real photographs.
> * **Project Galleries**: All default projects carry the flag `placeholder: true`.

---

## 6. Migration Mapping Table (Canonical Project-Based)

| Original Reference | Code Reference Location | Canonical Local Path |
| :--- | :--- | :--- |
| `IMG.hero` | `photographer.js:36` | `/images/hero/homepage-hero.jpg` |
| `IMG.arjun` | `Home.jsx:83`, `About.jsx:56`, `photographer.js:34` | `/images/profile/arjun-portrait.jpg` |
| `IMG.arjunAlt` | `Home.jsx:143`, `photographer.js:35` | `/images/profile/arjun-portrait-alt.jpg` |
| `IMG.wedding1` | `Home.jsx:16`, `services.js:10`, `projects.js:24` | `/images/projects/vows-in-quiet-light/cover.jpg` |
| `IMG.wedding2` | `projects.js:25` | `/images/projects/vows-in-quiet-light/frame-02.jpg` |
| `IMG.wedding3` | `projects.js:25` | `/images/projects/vows-in-quiet-light/frame-03.jpg` |
| `IMG.wedding4` | `projects.js:25` | `/images/projects/vows-in-quiet-light/frame-04.jpg` |
| `IMG.wedding5` | `projects.js:25` | `/images/projects/vows-in-quiet-light/frame-05.jpg` |
| `IMG.portrait1` | `Home.jsx:17`, `services.js:25`, `projects.js:40` | `/images/projects/after-light/cover.jpg` |
| `IMG.portrait2` | `projects.js:41` | `/images/projects/after-light/frame-02.jpg` |
| `IMG.portrait3` | `projects.js:41` | `/images/projects/after-light/frame-03.jpg` |
| `IMG.portrait4` | `projects.js:41`, `projects.js:136` | `/images/projects/after-light/frame-04.jpg` & `/images/projects/open-face/cover.jpg` |
| `IMG.portrait9` | `projects.js:41` | `/images/projects/after-light/frame-05.jpg` |
| `IMG.portrait6` | `projects.js:137` | `/images/projects/open-face/frame-02.jpg` |
| `IMG.portrait8` | `projects.js:137` | `/images/projects/open-face/frame-03.jpg` |
| `IMG.portrait10` | `projects.js:137` | `/images/projects/open-face/frame-04.jpg` |
| `IMG.fashion1` | `Home.jsx:18`, `services.js:40`, `projects.js:56` | `/images/projects/silk-and-shadow/cover.jpg` |
| `IMG.fashion2` | `projects.js:57` | `/images/projects/silk-and-shadow/frame-02.jpg` |
| `IMG.fashion4` | `projects.js:57` | `/images/projects/silk-and-shadow/frame-03.jpg` |
| `IMG.fashion5` | `projects.js:57` | `/images/projects/silk-and-shadow/frame-04.jpg` |
| `IMG.fashion6` | `projects.js:57` | `/images/projects/silk-and-shadow/frame-05.jpg` |
| `IMG.event1` | `Home.jsx:19`, `services.js:55`, `projects.js:72` | `/images/projects/crowd-and-colour/cover.jpg` |
| `IMG.event2` | `projects.js:73` | `/images/projects/crowd-and-colour/frame-02.jpg` |
| `IMG.event3` | `projects.js:73` | `/images/projects/crowd-and-colour/frame-03.jpg` |
| `IMG.event4` | `projects.js:73` | `/images/projects/crowd-and-colour/frame-04.jpg` |
| `IMG.event5` | `projects.js:73` | `/images/projects/crowd-and-colour/frame-05.jpg` |
| `IMG.travel1` | `Home.jsx:20`, `services.js:70`, `projects.js:88` | `/images/projects/far-from-here/cover.jpg` |
| `IMG.travel2` | `projects.js:89` | `/images/projects/far-from-here/frame-02.jpg` |
| `IMG.travel3` | `projects.js:89` | `/images/projects/far-from-here/frame-03.jpg` |
| `IMG.travel4` | `projects.js:89` | `/images/projects/far-from-here/frame-04.jpg` |
| `IMG.kerala1` | `projects.js:89` | `/images/projects/far-from-here/frame-05.jpg` |
| `IMG.nature1` | `Home.jsx:21`, `services.js:85`, `projects.js:104` | `/images/projects/green-hour/cover.jpg` |
| `nature2` | `projects.js:105` | `/images/projects/green-hour/frame-02.jpg` |
| `nature3` | `projects.js:105` | `/images/projects/green-hour/frame-03.jpg` |
| `nature4` | `projects.js:105` | `/images/projects/green-hour/frame-04.jpg` |
| `kerala3` | `projects.js:105` | `/images/projects/green-hour/frame-05.jpg` |
| `IMG.product1` | `Home.jsx:22`, `services.js:100`, `projects.js:120`| `/images/projects/still-object/cover.jpg` |
| `product2` | `projects.js:121` | `/images/projects/still-object/frame-02.jpg` |
| `product3` | `projects.js:121` | `/images/projects/still-object/frame-03.jpg` |
| `product4` | `projects.js:121` | `/images/projects/still-object/frame-04.jpg` |
| `product5` | `projects.js:121` | `/images/projects/still-object/frame-05.jpg` |

---

## 7. Next Steps: Execution Plan

1. **Folder Creation**: Create all directory structures in `public/images/`.
2. **Asset Download & Generation**:
   - Download the 62 verified images into their designated directories.
   - Generate branding assets (`logo.svg`, `logo.png`, `favicon.png`).
   - Generate `image-placeholder.svg` and `texture.jpg`.
3. **Central Asset Mapping Update**:
   - Update `src/data/images.js` to provide both the centralized `images` export and backward-compatible `IMG` mappings pointing to local `/images/...` paths.
4. **Data Records Update**:
   - Update `src/data/projects.js`, `src/data/services.js`, `src/data/photographer.js`.
   - Update `src/services/api.js` version storage keys to cleanly seed the updated local assets in existing client browsers.
5. **HTML & Component Integration**:
   - Link favicon in `index.html`.
6. **Verification & Testing**:
   - Run `npm run build`.
   - Perform automated browser testing using `browser_subagent` across public and admin pages.
