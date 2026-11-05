const mongoose = require("mongoose");
const Discipline = require("../models/Discipline");

const slugify = (text) => {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const DEFAULT_PHOTOGRAPHY_DISCIPLINES = [
  "Wedding Photography",
  "Portrait Photography",
  "Fashion Photography",
  "Event Photography",
  "Travel Photography",
  "Nature Photography",
  "Product Photography",
];

const DEFAULT_VIDEOGRAPHY_DISCIPLINES = [
  "Cinematic Films",
  "Commercial Videos",
  "Music Videos",
  "Wedding Films",
  "Event Videos",
  "Promotional Videos",
  "Reels & Short Films",
];

/**
 * @desc    Get all disciplines (Public)
 * @route   GET /api/disciplines
 * @access  Public
 */
const getDisciplines = async (req, res) => {
  try {
    let disciplines = await Discipline.find().sort({ createdAt: 1 });

    // Seed default disciplines if collection is empty
    if (disciplines.length === 0) {
      const defaultDocs = [
        ...DEFAULT_PHOTOGRAPHY_DISCIPLINES.map((name) => ({
          name,
          type: "photography",
          slug: slugify(name),
        })),
        ...DEFAULT_VIDEOGRAPHY_DISCIPLINES.map((name) => ({
          name,
          type: "videography",
          slug: slugify(name),
        })),
      ];

      try {
        await Discipline.insertMany(defaultDocs, { ordered: false });
        disciplines = await Discipline.find().sort({ createdAt: 1 });
      } catch (seedErr) {
        console.warn("Discipline initial seed notice:", seedErr.message);
        disciplines = await Discipline.find().sort({ createdAt: 1 });
      }
    }

    if (req.query.type && ["photography", "videography"].includes(req.query.type.toLowerCase())) {
      disciplines = disciplines.filter((d) => d.type === req.query.type.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: disciplines.length,
      data: disciplines,
    });
  } catch (error) {
    console.error("Error fetching disciplines:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching disciplines",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new discipline (Admin only)
 * @route   POST /api/disciplines
 * @access  Private (Admin only)
 */
const createDiscipline = async (req, res) => {
  try {
    const { name, type = "photography" } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Discipline name is required",
      });
    }

    const cleanName = String(name).trim();
    const cleanType = ["photography", "videography"].includes(String(type).toLowerCase().trim())
      ? String(type).toLowerCase().trim()
      : "photography";

    // Check for duplicate discipline name (case-insensitive)
    const existing = await Discipline.findOne({
      name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Discipline "${cleanName}" already exists`,
      });
    }

    const discipline = await Discipline.create({
      name: cleanName,
      type: cleanType,
      slug: slugify(cleanName),
    });

    res.status(201).json({
      success: true,
      message: "Discipline created successfully",
      data: discipline,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A discipline with this name already exists",
      });
    }

    console.error("Error creating discipline:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating discipline",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete custom discipline (Admin only)
 * @route   DELETE /api/disciplines/:id
 * @access  Private (Admin only)
 */
const deleteDiscipline = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discipline ID",
      });
    }

    const discipline = await Discipline.findByIdAndDelete(id);

    if (!discipline) {
      return res.status(404).json({
        success: false,
        message: "Discipline not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Discipline deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting discipline:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting discipline",
      error: error.message,
    });
  }
};

module.exports = {
  getDisciplines,
  createDiscipline,
  deleteDiscipline,
};

