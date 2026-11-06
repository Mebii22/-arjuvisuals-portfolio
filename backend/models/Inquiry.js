const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    service: {
      type: String,
      required: [true, "Service selection is required"],
      trim: true,
    },
    eventDate: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    budget: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["new", "contacted", "responded", "closed", "reviewed", "archived"],
        message: "Status must be new, contacted, responded, closed, reviewed, or archived",
      },
      default: "new",
      lowercase: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for frontend id compatibility
inquirySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
inquirySchema.set("toJSON", { virtuals: true });
inquirySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Inquiry", inquirySchema);

