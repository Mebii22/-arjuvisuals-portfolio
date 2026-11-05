const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["photography", "videography"],
        message: "Type must be either photography or videography",
      },
      default: "photography",
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Project category / discipline is required"],
      trim: true,
    },
    subCategory: {
      type: String,
      default: "",
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
      trim: true,
    },
    cover: {
      type: String,
      default: "",
      trim: true,
    },
    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
    videoStills: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    videoProvider: {
      type: String,
      default: "auto",
      trim: true,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
    },
    shootDate: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    short: {
      type: String,
      default: "",
      trim: true,
    },
    photoLocations: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "Status must be either draft or published",
      },
      default: "draft",
      lowercase: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      default: "",
      trim: true,
    },
    placeholder: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;

        // Ensure cover / coverImage / thumbnail are consistently populated
        const c = ret.coverImage || ret.cover || ret.thumbnail || "";
        ret.cover = c;
        ret.coverImage = c;
        ret.thumbnail = ret.thumbnail || c;

        // Ensure gallery / images / videoStills are consistently populated
        const g = Array.isArray(ret.gallery) && ret.gallery.length > 0
          ? ret.gallery
          : (Array.isArray(ret.images) && ret.images.length > 0
            ? ret.images
            : (Array.isArray(ret.videoStills) && ret.videoStills.length > 0 ? ret.videoStills : []));
        ret.gallery = g;
        ret.images = g;
        ret.videoStills = Array.isArray(ret.videoStills) && ret.videoStills.length > 0 ? ret.videoStills : g;

        // Ensure category and subCategory are synced
        ret.category = ret.category || ret.subCategory || (ret.type === "videography" ? "Cinematic Films" : "Wedding Photography");
        ret.subCategory = ret.subCategory || ret.category;

        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        const c = ret.coverImage || ret.cover || ret.thumbnail || "";
        ret.cover = c;
        ret.coverImage = c;
        ret.thumbnail = ret.thumbnail || c;

        const g = Array.isArray(ret.gallery) && ret.gallery.length > 0
          ? ret.gallery
          : (Array.isArray(ret.images) && ret.images.length > 0
            ? ret.images
            : (Array.isArray(ret.videoStills) && ret.videoStills.length > 0 ? ret.videoStills : []));
        ret.gallery = g;
        ret.images = g;
        ret.videoStills = Array.isArray(ret.videoStills) && ret.videoStills.length > 0 ? ret.videoStills : g;

        ret.category = ret.category || ret.subCategory || (ret.type === "videography" ? "Cinematic Films" : "Wedding Photography");
        ret.subCategory = ret.subCategory || ret.category;

        return ret;
      },
    },
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
