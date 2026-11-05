const mongoose = require("mongoose");
const Inquiry = require("../models/Inquiry");

/**
 * @desc    Submit a new inquiry (Public)
 * @route   POST /api/inquiries
 * @access  Public
 */
const createInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone = "",
      service,
      eventDate = "",
      location = "",
      budget = "",
      message,
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Your name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Your email address is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!service || !service.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a service",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message or project details",
      });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service.trim(),
      eventDate: eventDate.trim(),
      location: location.trim(),
      budget: budget.trim(),
      message: message.trim(),
      status: "new",
      notes: "",
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    console.error("Submit Inquiry Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while saving inquiry",
    });
  }
};

/**
 * @desc    Get all inquiries (Admin only)
 * @route   GET /api/inquiries
 * @access  Private (Admin)
 */
const getInquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && ["new", "reviewed", "responded", "archived"].includes(req.query.status.toLowerCase())) {
      filter.status = req.query.status.toLowerCase();
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error("Get Inquiries Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching inquiries",
    });
  }
};

/**
 * @desc    Get single inquiry by ID (Admin only)
 * @route   GET /api/inquiries/:id
 * @access  Private (Admin)
 */
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID format",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Get Inquiry By ID Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching inquiry",
    });
  }
};

/**
 * @desc    Update inquiry status or internal notes (Admin only)
 * @route   PUT /api/inquiries/:id
 * @access  Private (Admin)
 */
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID format",
      });
    }

    const updateData = {};
    if (req.body.status !== undefined) {
      const st = String(req.body.status).toLowerCase().trim();
      if (["new", "reviewed", "responded", "archived"].includes(st)) {
        updateData.status = st;
      }
    }
    if (req.body.notes !== undefined) {
      updateData.notes = String(req.body.notes).trim();
    }

    const updated = await Inquiry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Inquiry Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating inquiry",
    });
  }
};

/**
 * @desc    Delete inquiry (Admin only)
 * @route   DELETE /api/inquiries/:id
 * @access  Private (Admin)
 */
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID format",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    await Inquiry.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete Inquiry Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting inquiry",
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
};

