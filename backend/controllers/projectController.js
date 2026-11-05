const mongoose = require("mongoose");
const Project = require("../models/Project");

const slugify = (text) => {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
const addProject = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      subCategory,
      coverImage,
      cover,
      thumbnail,
      images,
      gallery,
      videoStills,
      status,
      featured,
      videoUrl,
      videoProvider,
      duration,
      shootDate,
      slug,
      location,
      short,
      photoLocations,
      placeholder,
    } = req.body;

    // Validate required fields
    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    if (!description || !String(description).trim()) {
      return res.status(400).json({
        success: false,
        message: "Project description is required",
      });
    }

    const cleanType =
      type === "videography" ||
      (typeof category === "string" && category.toLowerCase().includes("video"))
        ? "videography"
        : "photography";

    const cleanCategory =
      (category && String(category).trim()) ||
      (subCategory && String(subCategory).trim()) ||
      (cleanType === "videography" ? "Cinematic Films" : "Wedding Photography");

    const resolvedCover = (coverImage || cover || thumbnail || "").trim();

    // If publishing, cover/thumbnail is required
    const targetStatus = status === "published" ? "published" : "draft";
    if (targetStatus === "published" && !resolvedCover) {
      return res.status(400).json({
        success: false,
        message:
          cleanType === "videography"
            ? "A video thumbnail / cover image is required to publish"
            : "A cover photograph is required to publish",
      });
    }

    // If publishing videography, videoUrl is required
    if (targetStatus === "published" && cleanType === "videography" && !String(videoUrl || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "A video source or URL is required to publish a videography project",
      });
    }

    const resolvedGallery = Array.isArray(gallery) && gallery.length > 0
      ? gallery
      : (Array.isArray(images) && images.length > 0
        ? images
        : (Array.isArray(videoStills) ? videoStills : []));

    const finalSlug = slug && String(slug).trim() ? slugify(slug) : slugify(title);

    // Create new project with Mongoose
    const project = await Project.create({
      title: String(title).trim(),
      description: String(description).trim(),
      type: cleanType,
      category: cleanCategory,
      subCategory: cleanCategory,
      coverImage: resolvedCover,
      cover: resolvedCover,
      thumbnail: (thumbnail || resolvedCover).trim(),
      images: resolvedGallery,
      gallery: resolvedGallery,
      videoStills: Array.isArray(videoStills) ? videoStills : resolvedGallery,
      status: targetStatus,
      featured: typeof featured === "boolean" ? featured : false,
      videoUrl: (videoUrl || "").trim(),
      videoProvider: videoProvider || "auto",
      duration: (duration || "").trim(),
      shootDate: (shootDate || "").trim(),
      slug: finalSlug,
      location: (location || "").trim(),
      short: (short || "").trim(),
      photoLocations: photoLocations || {},
      placeholder: Boolean(placeholder),
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    console.error("Add Project Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating project",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all published projects (Public)
 * @route   GET /api/projects
 * @access  Public
 */
const getPublishedProjects = async (req, res) => {
  try {
    const filter = { status: "published" };

    // Filter by type (photography vs videography)
    if (req.query.type && ["photography", "videography"].includes(req.query.type.toLowerCase())) {
      filter.type = req.query.type.toLowerCase();
    }

    // Filter by category or discipline name (case-insensitive)
    if (req.query.category && req.query.category.toLowerCase() !== "all") {
      const catRegex = new RegExp(`^${req.query.category.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
      filter.$or = [{ category: catRegex }, { subCategory: catRegex }];
    }

    // Filter by featured status
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === "true";
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get Published Projects Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching published projects",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all projects including drafts (Admin)
 * @route   GET /api/projects/admin/all
 * @access  Private (Admin only)
 */
const getAllProjects = async (req, res) => {
  try {
    const filter = {};

    if (req.query.type && ["photography", "videography"].includes(req.query.type.toLowerCase())) {
      filter.type = req.query.type.toLowerCase();
    }

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status.toLowerCase().trim();
    }

    if (req.query.category && req.query.category.toLowerCase() !== "all") {
      const catRegex = new RegExp(`^${req.query.category.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
      filter.$or = [{ category: catRegex }, { subCategory: catRegex }];
    }

    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === "true";
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get All Projects Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all projects",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single project by ID or slug
 * @route   GET /api/projects/:id
 * @access  Public (drafts restricted to admin)
 */
const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    let project = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }
    if (!project) {
      project = await Project.findOne({ slug: id });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Direct URL access: if draft, only authenticated admin can view it
    if (project.status !== "published") {
      let isAuthedAdmin = false;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const jwt = require("jsonwebtoken");
          const Admin = require("../models/Admin");
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const admin = await Admin.findById(decoded.id);
          if (admin && admin.role === "admin") {
            isAuthedAdmin = true;
          }
        } catch {}
      }

      if (!isAuthedAdmin) {
        return res.status(404).json({
          success: false,
          message: "Project not found or is currently private",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get Single Project Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project",
      error: error.message,
    });
  }
};

/**
 * @desc    Update existing project (supports safe partial updates)
 * @route   PUT /api/projects/:id
 * @access  Private (Admin only)
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const existing = await Project.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    // Normalize and synchronize cover / coverImage / thumbnail
    if (updateData.cover !== undefined || updateData.coverImage !== undefined || updateData.thumbnail !== undefined) {
      const c = (updateData.cover || updateData.coverImage || updateData.thumbnail || "").trim();
      updateData.cover = c;
      updateData.coverImage = c;
      if (updateData.thumbnail === undefined) updateData.thumbnail = c;
    }

    // Normalize and synchronize gallery / images / videoStills
    if (updateData.gallery !== undefined || updateData.images !== undefined || updateData.videoStills !== undefined) {
      const g = Array.isArray(updateData.gallery)
        ? updateData.gallery
        : (Array.isArray(updateData.images) ? updateData.images : (Array.isArray(updateData.videoStills) ? updateData.videoStills : []));
      updateData.gallery = g;
      updateData.images = g;
      if (updateData.videoStills === undefined && existing.type === "videography") {
        updateData.videoStills = g;
      }
    }

    // Normalize category / subCategory
    if (updateData.category !== undefined) {
      updateData.category = String(updateData.category).trim();
      updateData.subCategory = updateData.category;
    }

    if (updateData.type !== undefined) {
      updateData.type = updateData.type === "videography" ? "videography" : "photography";
    }

    if (updateData.title !== undefined) updateData.title = String(updateData.title).trim();
    if (updateData.description !== undefined) updateData.description = String(updateData.description).trim();
    if (updateData.videoUrl !== undefined) updateData.videoUrl = String(updateData.videoUrl).trim();
    if (updateData.slug !== undefined) updateData.slug = slugify(updateData.slug);

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    console.error("Update Project Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating project",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin only)
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting project",
      error: error.message,
    });
  }
};

module.exports = {
  addProject,
  getPublishedProjects,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
