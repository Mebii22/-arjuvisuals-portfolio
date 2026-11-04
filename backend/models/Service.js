const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Service category is required"],
      enum: {
        values: ["photography", "videography"],
        message: "Category must be either photography or videography",
      },
      default: "photography",
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "Status must be either draft or published",
      },
      default: "published",
      lowercase: true,
      trim: true,
    },
    cover: {
      type: String,
      default: "",
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    startingPrice: {
      type: String,
      default: "",
      trim: true,
    },
    slug: {
      type: String,
      default: "",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.published = ret.status === "published";
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.published = ret.status === "published";
        return ret;
      },
    },
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;

