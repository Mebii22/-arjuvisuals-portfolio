const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const Project = require("./models/Project");

// Default projects representing the 10 existing projects
const legacyProjects = [
  {
    title: "Wedding Photography",
    slug: "wedding-photography",
    category: "photography",
    subCategory: "Wedding Photography",
    location: "Kerala",
    short: "Wedding frames that stay with the glance, not the checklist.",
    description:
      "A wedding series built on stillness — silhouette, fabric, and the held look between two people. Authentic coverage illustrating the refined direction of Arjun’s wedding work.",
    coverImage: "/images/projects/wedding-photography/cover.jpg",
    images: [
      "/images/projects/wedding-photography/frame-01.jpg",
      "/images/projects/wedding-photography/frame-02.jpg",
      "/images/projects/wedding-photography/frame-03.jpg",
      "/images/projects/wedding-photography/frame-04.jpg",
      "/images/projects/wedding-photography/frame-05.jpg",
    ],
    featured: true,
    status: "published",
  },
  {
    title: "Portrait Photography",
    slug: "portrait-photography",
    category: "photography",
    subCategory: "Portrait Photography",
    location: "Thrissur, Kerala",
    short: "Quiet portraits built around natural window light and stillness.",
    description:
      "A portrait study exploring how late-day light settles on a face. Restraint, simple backdrops, unforced expression. Clean composition and authentic character.",
    coverImage: "/images/projects/portrait-photography/cover.jpg",
    images: [
      "/images/projects/portrait-photography/frame-01.jpg",
      "/images/projects/portrait-photography/frame-02.jpg",
      "/images/projects/portrait-photography/frame-03.jpg",
      "/images/projects/portrait-photography/frame-04.jpg",
      "/images/projects/portrait-photography/frame-05.jpg",
    ],
    featured: true,
    status: "published",
  },
  {
    title: "Fashion Photography",
    slug: "fashion-photography",
    category: "photography",
    subCategory: "Fashion Photography",
    location: "Kochi",
    short: "Editorial fashion — texture, silhouette, and mood.",
    description:
      "An editorial fashion sequence built on contrast: hard shadow against fabric, colour against grain. Editorial and lookbook photography with thoughtful direction.",
    coverImage: "/images/projects/fashion-photography/cover.jpg",
    images: [
      "/images/projects/fashion-photography/frame-01.jpg",
      "/images/projects/fashion-photography/frame-02.jpg",
      "/images/projects/fashion-photography/frame-03.jpg",
      "/images/projects/fashion-photography/frame-04.jpg",
      "/images/projects/fashion-photography/frame-05.jpg",
    ],
    featured: false,
    status: "draft",
  },
  {
    title: "Event Photography",
    slug: "event-photography",
    category: "photography",
    subCategory: "Event Photography",
    location: "Kerala",
    short: "Live energy, stage light, and the in-between glances of a night.",
    description:
      "Event coverage that treats a gathering as a story — wide atmosphere, tight emotion, practical colour. Live stage and gathering photography.",
    coverImage: "/images/projects/event-photography/cover.jpg",
    images: [
      "/images/projects/event-photography/frame-01.jpg",
      "/images/projects/event-photography/frame-02.jpg",
      "/images/projects/event-photography/frame-03.jpg",
      "/images/projects/event-photography/frame-04.jpg",
      "/images/projects/event-photography/frame-05.jpg",
    ],
    featured: false,
    status: "draft",
  },
  {
    title: "Travel Photography",
    slug: "travel-photography",
    category: "photography",
    subCategory: "Travel Photography",
    location: "Coast & highland",
    short: "Journeys told in ridgelines, water, and the last light of the day.",
    description:
      "Travel frames that favour place over postcard — scale, weather, and the figure inside it. Landscape and journey series with natural light.",
    coverImage: "/images/projects/travel-photography/cover.jpg",
    images: [
      "/images/projects/travel-photography/frame-01.jpg",
      "/images/projects/travel-photography/frame-02.jpg",
      "/images/projects/travel-photography/frame-03.jpg",
      "/images/projects/travel-photography/frame-04.jpg",
      "/images/projects/travel-photography/frame-05.jpg",
    ],
    featured: true,
    status: "published",
  },
  {
    title: "Nature Photography",
    slug: "nature-photography",
    category: "photography",
    subCategory: "Nature Photography",
    location: "Western Ghats",
    short: "Mist, canopy, and water — nature as atmosphere.",
    description:
      "A nature study of forest, fall, and monsoon green. Forest canopy and water landscape photography honouring Western Ghats terrain.",
    coverImage: "/images/projects/nature-photography/cover.jpg",
    images: [
      "/images/projects/nature-photography/frame-01.jpg",
      "/images/projects/nature-photography/frame-02.jpg",
      "/images/projects/nature-photography/frame-03.jpg",
      "/images/projects/nature-photography/frame-04.jpg",
      "/images/projects/nature-photography/frame-05.jpg",
    ],
    featured: true,
    status: "published",
  },
  {
    title: "Product Photography",
    slug: "product-photography",
    category: "photography",
    subCategory: "Product Photography",
    location: "Studio",
    short: "Object studies with controlled light and tactile surfaces.",
    description:
      "Product stills designed to feel considered rather than clinical. Light shaped to reveal material, form, and texture for commercial and studio work.",
    coverImage: "/images/projects/product-photography/cover.jpg",
    images: [
      "/images/projects/product-photography/frame-01.jpg",
      "/images/projects/product-photography/frame-02.jpg",
      "/images/projects/product-photography/frame-03.jpg",
      "/images/projects/product-photography/frame-04.jpg",
      "/images/projects/product-photography/frame-05.jpg",
    ],
    featured: false,
    status: "draft",
  },
  {
    title: "Western Ghats Monsoon",
    slug: "western-ghats-monsoon",
    category: "videography",
    subCategory: "Cinematic Films",
    location: "Western Ghats, Kerala",
    short: "A cinematic visual study of monsoon mist, canopy, and rain shadows across Kerala.",
    description:
      "Visual media production capturing the pace and atmosphere of monsoon rainfall moving across the Western Ghats. Framed and colour-graded by Arjun Murali with an emphasis on ambient sound, natural stillness, and textural depth.",
    coverImage: "/images/projects/nature-photography/cover.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    images: [
      "/images/projects/nature-photography/frame-01.jpg",
      "/images/projects/nature-photography/frame-02.jpg",
      "/images/projects/nature-photography/frame-03.jpg",
    ],
    featured: true,
    status: "published",
  },
  {
    title: "The Maker’s Hands",
    slug: "the-makers-hands",
    category: "videography",
    subCategory: "Commercial Videos",
    location: "Thrissur, Kerala",
    short: "A tactile commercial short capturing handcrafted pottery, clay molding, and kiln fire.",
    description:
      "A commercial visual campaign produced for an independent artisan studio in Thrissur. Close-up macro shots, natural workshop audio, and warm editorial color-grading designed to highlight material authenticity.",
    coverImage: "/images/projects/product-photography/cover.jpg",
    videoUrl: "https://vimeo.com/76979871",
    images: [
      "/images/projects/product-photography/frame-01.jpg",
      "/images/projects/product-photography/frame-02.jpg",
    ],
    featured: true,
    status: "published",
  },
  {
    title: "Vows by the Backwaters",
    slug: "vows-by-the-backwaters",
    category: "videography",
    subCategory: "Wedding Films",
    location: "Kerala Backwaters",
    short: "Intimate wedding highlights focusing on heartfelt glances, stillness, and Kerala river light.",
    description:
      "An unscripted, documentary-inspired wedding highlight film. Favouring candid emotion and natural available light over artificial stage lighting, capturing the unforced connection between two families.",
    coverImage: "/images/projects/wedding-photography/cover.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    images: [
      "/images/projects/wedding-photography/frame-01.jpg",
      "/images/projects/wedding-photography/frame-02.jpg",
      "/images/projects/wedding-photography/frame-03.jpg",
    ],
    featured: true,
    status: "published",
  },
];

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    let imported = 0;
    let skipped = 0;

    for (const p of legacyProjects) {
      // Check if project already exists by slug or title
      const exists = await Project.findOne({
        $or: [
          { slug: p.slug },
          { title: p.title }
        ]
      });

      if (exists) {
        skipped++;
        console.log(`Skipping (already exists): ${p.title}`);
      } else {
        await Project.create(p);
        imported++;
        console.log(`Imported: ${p.title} (${p.category} - ${p.status})`);
      }
    }

    console.log("\nMigration completed successfully:");
    console.log(`- Imported: ${imported}`);
    console.log(`- Skipped: ${skipped}`);
    console.log(`- Total in collection: ${await Project.countDocuments()}`);

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
}

migrate();
