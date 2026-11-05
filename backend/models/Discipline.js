const mongoose = require("mongoose");

const disciplineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Discipline name is required"],
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
    slug: {
      type: String,
      trim: true,
    },
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

// Case-insensitive unique index on discipline name
disciplineSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

const Discipline = mongoose.model("Discipline", disciplineSchema);

module.exports = Discipline;

