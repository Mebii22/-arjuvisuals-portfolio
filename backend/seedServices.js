const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const Service = require("./models/Service");

const INITIAL_SERVICES = [
  // --- PHOTOGRAPHY SERVICES ---
  {
    title: "Wedding Photography",
    slug: "wedding-photography",
    category: "photography",
    status: "published",
    description:
      "Thoughtful wedding coverage — vows, quiet in-betweens, and the feeling of the day rather than a shot list.",
    cover: "/images/projects/wedding-photography/cover.jpg",
    features: [
      "Ceremony and reception coverage",
      "Candid and portrait work",
      "Natural and available light",
      "A refined edit, not a dump of files",
    ],
    startingPrice: "",
    featured: true,
    order: 1,
  },
  {
    title: "Portrait Photography",
    slug: "portrait-photography",
    category: "photography",
    status: "published",
    description:
      "Expressive portraits that highlight personality, mood, and authentic character.",
    cover: "/images/projects/portrait-photography/cover.jpg",
    features: [
      "Personal and editorial portraits",
      "Natural and shaped lighting",
      "Direction that stays unforced",
      "Colour and black-and-white finishes",
    ],
    startingPrice: "",
    featured: true,
    order: 2,
  },
  {
    title: "Fashion Photography",
    slug: "fashion-photography",
    category: "photography",
    status: "published",
    description:
      "Editorial and lookbook fashion with attention to silhouette, textile, and atmosphere.",
    cover: "/images/projects/fashion-photography/cover.jpg",
    features: [
      "Editorial series and lookbooks",
      "Location and studio work",
      "Styling-aware direction",
      "Colour-graded finishing",
    ],
    startingPrice: "",
    featured: false,
    order: 3,
  },
  {
    title: "Event Photography",
    slug: "event-photography",
    category: "photography",
    status: "published",
    description:
      "Coverage of gatherings, stages, and real interactions — energy without the clutter.",
    cover: "/images/projects/event-photography/cover.jpg",
    features: [
      "Candid and key-moment coverage",
      "Available-light sensitivity",
      "A clear visual narrative of the night",
      "A considered edit",
    ],
    startingPrice: "",
    featured: false,
    order: 4,
  },
  {
    title: "Travel Photography",
    slug: "travel-photography",
    category: "photography",
    status: "published",
    description:
      "Place, weather, and the figure in the landscape — travel frames with a cinematic quiet.",
    cover: "/images/projects/travel-photography/cover.jpg",
    features: [
      "Landscape and journey series",
      "Documentary travel portraits",
      "Golden-hour and atmosphere work",
      "Sequence editing",
    ],
    startingPrice: "",
    featured: false,
    order: 5,
  },
  {
    title: "Nature Photography",
    slug: "nature-photography",
    category: "photography",
    status: "published",
    description:
      "Forest, water, and monsoon green — nature as mood, not a postcard.",
    cover: "/images/projects/nature-photography/cover.jpg",
    features: [
      "Landscape and detail studies",
      "Mist, canopy, and water",
      "Western Ghats and Kerala terrain",
      "Print-ready finishing",
    ],
    startingPrice: "",
    featured: false,
    order: 6,
  },
  {
    title: "Product Photography",
    slug: "product-photography",
    category: "photography",
    status: "published",
    description:
      "Object imagery with composition, lighting, and material honesty for brands and makers.",
    cover: "/images/projects/product-photography/cover.jpg",
    features: [
      "Studio still life",
      "Lifestyle product context",
      "Consistent series for campaigns",
      "Web and print delivery",
    ],
    startingPrice: "",
    featured: false,
    order: 7,
  },

  // --- VIDEOGRAPHY SERVICES ---
  {
    title: "Wedding Films",
    slug: "wedding-films",
    category: "videography",
    status: "published",
    description:
      "Cinematic wedding films capturing emotion, natural audio, vows, and the rhythm of your day.",
    cover: "/images/projects/wedding-photography/frame-04.jpg",
    features: [
      "Full ceremony and speeches documentation",
      "4K cinematic highlight film",
      "Multi-angle camera coverage",
      "Professional sound design and color grading",
    ],
    startingPrice: "",
    featured: true,
    order: 8,
  },
  {
    title: "Commercial Videos",
    slug: "commercial-videos",
    category: "videography",
    status: "published",
    description:
      "Brand stories and product reels tailored for campaigns, web showcases, and social launches.",
    cover: "/images/projects/product-photography/cover.jpg",
    features: [
      "Brand storytelling and commercials",
      "Product motion showcases",
      "Social-first aspect ratios (9:16 and 16:9)",
      "Studio and on-location production",
    ],
    startingPrice: "",
    featured: true,
    order: 9,
  },
  {
    title: "Event Videography",
    slug: "event-videography",
    category: "videography",
    status: "published",
    description:
      "High-energy festival, corporate, and private event recaps with dynamic pacing and real atmosphere.",
    cover: "/images/projects/event-photography/cover.jpg",
    features: [
      "Comprehensive event recap edits",
      "Same-day or 48-hour teaser deliverables",
      "Stage and attendee coverage",
      "Licensed soundtrack audio",
    ],
    startingPrice: "",
    featured: false,
    order: 10,
  },
  {
    title: "Promotional Videos",
    slug: "promotional-videos",
    category: "videography",
    status: "published",
    description:
      "Impactful promotional media designed to communicate vision, craft, and distinct identity.",
    cover: "/images/projects/fashion-photography/cover.jpg",
    features: [
      "Visual pitch and portfolio videos",
      "Artistic direction and framing",
      "Optimized web delivery",
      "Clean motion and grading",
    ],
    startingPrice: "",
    featured: false,
    order: 11,
  },
  {
    title: "Cinematic Films",
    slug: "cinematic-films",
    category: "videography",
    status: "published",
    description:
      "Narrative, documentary, and landscape short films grounded in light, sound, and mood.",
    cover: "/images/projects/nature-photography/cover.jpg",
    features: [
      "Documentary & short film production",
      "Drone and landscape cinematography",
      "Original score integration",
      "Cinema-grade color grading",
    ],
    startingPrice: "",
    featured: false,
    order: 12,
  },
];

async function seedServices() {
  let created = 0;
  let skipped = 0;

  for (const s of INITIAL_SERVICES) {
    const exists = await Service.findOne({
      $or: [{ slug: s.slug }, { title: s.title }],
    });

    if (exists) {
      skipped++;
    } else {
      await Service.create(s);
      created++;
    }
  }

  return { created, skipped, total: await Service.countDocuments() };
}

if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log("Connected to MongoDB for service seeding...");
      const result = await seedServices();
      console.log(
        `Service seeding complete: ${result.created} created, ${result.skipped} already existed. Total services: ${result.total}`
      );
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error seeding services:", err.message);
      process.exit(1);
    });
}

module.exports = { seedServices, INITIAL_SERVICES };

