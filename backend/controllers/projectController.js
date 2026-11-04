const mongoose = require("mongoose");
const Project = require("../models/Project");

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
const addProject = async (req, res) => {
  try {
    const { title, description, category, coverImage, images, status, featured, videoUrl, slug, location, short } = req.body;

    // Validate required fields
    if (!title || !description || !category || !coverImage) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, and coverImage are required fields",
      });
    }

    // Create new project with Mongoose
    const project = await Project.create({
      title,
      description,
      category,
      coverImage,
      images: Array.isArray(images) ? images : [],
      status: status || "draft",
      featured: typeof featured === "boolean" ? featured : false,
      videoUrl: videoUrl || "",
      slug: slug || "",
      location: location || "",
      short: short || "",
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
    });
  }
};

/**
 * @desc    Get all published projects (Public)
 * @route   GET /api/projects
 * @access  Public
 * @query   category (optional), featured (optional)
 */
const getPublishedProjects = async (req, res) => {
  try {
    // Base filter: only show published projects to public users
    const filter = { status: "published" };

    // Filter by category (photography or videography)
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase().trim();
    }

    // Filter by featured status
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === "true";
    }

    // Sort newest first
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

    // Support optional filters for admin dashboard
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase().trim();
    }
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status.toLowerCase().trim();
    }
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === "true";
    }

    // Return all projects, newest first
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
    });
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
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
    });
  }
};

/**
 * @desc    Update existing project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin only)
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    // Strip immutable _id if present in request body
    const updateData = { ...req.body };
    delete updateData._id;

    // Find and update project with validators enabled
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Re-run schema validators on update
      }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

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

    // Validate MongoDB ObjectId format
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

