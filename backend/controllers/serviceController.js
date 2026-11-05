const mongoose = require("mongoose");
const Service = require("../models/Service");

const slugify = (text) => {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * @desc    Get all published services (Public)
 * @route   GET /api/services
 * @access  Public
 */
const getPublicServices = async (req, res) => {
  try {
    const filter = { status: "published" };

    if (req.query.category && ["photography", "videography"].includes(req.query.category.toLowerCase())) {
      filter.category = req.query.category.toLowerCase();
    }

    const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching public services:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching services",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all services including drafts (Admin)
 * @route   GET /api/services/admin/all
 * @access  Private (Admin only)
 */
const getAllServicesAdmin = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status && ["draft", "published"].includes(req.query.status.toLowerCase())) {
      filter.status = req.query.status.toLowerCase();
    }

    if (req.query.category && ["photography", "videography"].includes(req.query.category.toLowerCase())) {
      filter.category = req.query.category.toLowerCase();
    }

    const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching admin services:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching services",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single service by ID
 * @route   GET /api/services/:id
 * @access  Public
 */
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Direct URL access: if draft, only authenticated admin can view it
    if (service.status !== "published") {
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
        } catch {
          // Token invalid or expired
        }
      }

      if (!isAuthedAdmin) {
        return res.status(404).json({
          success: false,
          message: "Service not found or is currently private",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching service",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new service
 * @route   POST /api/services
 * @access  Private (Admin only)
 */
const addService = async (req, res) => {
  try {
    const {
      title,
      description,
      category = "photography",
      status = "published",
      cover = "",
      features = [],
      startingPrice = "",
      slug,
      featured = false,
      order = 0,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service title is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service description is required",
      });
    }

    const validCategory = ["photography", "videography"].includes(category.toLowerCase())
      ? category.toLowerCase()
      : "photography";

    const validStatus = ["draft", "published"].includes(String(status).toLowerCase())
      ? String(status).toLowerCase()
      : (req.body.published !== undefined ? (req.body.published ? "published" : "draft") : "published");

    const featuresArray = Array.isArray(features)
      ? features.map((f) => String(f).trim()).filter(Boolean)
      : typeof features === "string"
      ? features.split("\n").map((f) => f.trim()).filter(Boolean)
      : [];

    const finalSlug = slug && slug.trim() ? slugify(slug) : slugify(title);

    const service = await Service.create({
      title: title.trim(),
      description: description.trim(),
      category: validCategory,
      status: validStatus,
      cover: cover.trim(),
      features: featuresArray,
      startingPrice: startingPrice.trim(),
      slug: finalSlug,
      featured: Boolean(featured),
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating service",
      error: error.message,
    });
  }
};

/**
 * @desc    Update service (supports partial updates)
 * @route   PUT /api/services/:id
 * @access  Private (Admin only)
 */
const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const updateData = {};
    const body = req.body;

    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.category !== undefined) {
      const cat = String(body.category).toLowerCase().trim();
      if (["photography", "videography"].includes(cat)) {
        updateData.category = cat;
      }
    }
    if (body.status !== undefined) {
      const st = String(body.status).toLowerCase().trim();
      if (["draft", "published"].includes(st)) {
        updateData.status = st;
      }
    } else if (body.published !== undefined) {
      updateData.status = body.published ? "published" : "draft";
    }
    if (body.cover !== undefined) updateData.cover = String(body.cover).trim();
    if (body.startingPrice !== undefined) updateData.startingPrice = String(body.startingPrice).trim();
    if (body.slug !== undefined) updateData.slug = slugify(body.slug);
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.order !== undefined) updateData.order = Number(body.order) || 0;

    if (body.features !== undefined) {
      if (Array.isArray(body.features)) {
        updateData.features = body.features.map((f) => String(f).trim()).filter(Boolean);
      } else if (typeof body.features === "string") {
        updateData.features = body.features.split("\n").map((f) => f.trim()).filter(Boolean);
      }
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating service",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private (Admin only)
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting service",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicServices,
  getAllServicesAdmin,
  getServiceById,
  addService,
  updateService,
  deleteService,
};

