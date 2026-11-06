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

    // Send notification email to admin via nodemailer (fail-safe)
    let emailSent = false;
    let emailErrorMsg = null;
    try {
      const nodemailer = require("nodemailer");
      const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
      const user = process.env.SMTP_USER || process.env.EMAIL_USER;
      const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
      const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
      const adminEmail = process.env.ADMIN_EMAIL || user || "arjuvisuals.co@gmail.com";

      if (user && pass) {
        const transportConfig = host
          ? {
              host,
              port,
              secure: port === 465,
              auth: { user, pass },
            }
          : {
              service: "gmail",
              auth: { user, pass },
            };

        const transporter = nodemailer.createTransport(transportConfig);

        const inquiryTimestamp = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "medium",
        });

        const mailOptions = {
          from: `"ArjuVisuals Portfolio" <${user}>`,
          to: adminEmail,
          replyTo: email.trim(),
          subject: `New Inquiry from ${name.trim()} — ArjuVisuals.co`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1a202c;">
              <div style="border-bottom: 2px solid #004643; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="color: #004643; margin: 0; font-size: 20px;">New Inquiry Received — ArjuVisuals.co</h2>
                <p style="color: #718096; margin: 4px 0 0; font-size: 13px;">Date &amp; Time: ${inquiryTimestamp}</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: bold; width: 140px; color: #4a5568;">Customer Name:</td><td style="padding: 10px 0; color: #1a202c; font-weight: 600;">${name.trim()}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Customer Email:</td><td style="padding: 10px 0;"><a href="mailto:${email.trim()}" style="color: #004643; font-weight: 500;">${email.trim()}</a></td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Customer Phone:</td><td style="padding: 10px 0;"><a href="tel:${phone.trim()}" style="color: #004643;">${phone.trim() || "Not provided"}</a></td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Requested Service:</td><td style="padding: 10px 0; font-weight: 600; color: #004643;">${service.trim()}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Preferred Date / Timeline:</td><td style="padding: 10px 0; color: #1a202c;">${eventDate.trim() || "Flexible / TBC"}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Location:</td><td style="padding: 10px 0; color: #1a202c;">${location.trim() || "Not specified"}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Budget:</td><td style="padding: 10px 0; color: #1a202c;">${budget.trim() || "Not specified"}</td></tr>
              </table>

              <div style="margin-top: 16px;">
                <h3 style="color: #004643; font-size: 15px; margin: 0 0 8px;">Customer Message:</h3>
                <div style="background: #f7fafc; padding: 16px; border-left: 4px solid #004643; border-radius: 4px; white-space: pre-line; font-size: 14px; line-height: 1.6; color: #2d3748;">
                  ${message.trim()}
                </div>
              </div>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #edf2f7; font-size: 12px; color: #718096;">
                💡 <em>Click <strong>Reply</strong> in your email client to email <strong>${name.trim()}</strong> directly at <strong>${email.trim()}</strong>.</em>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`[Inquiry] Notification email sent successfully to ${adminEmail}`);
      } else {
        console.log("[Inquiry] SMTP credentials (SMTP_USER/SMTP_PASS) not configured, email notification skipped.");
      }
    } catch (emailErr) {
      emailErrorMsg = emailErr.message;
      console.warn("[Inquiry] Email notification failed:", emailErr.message);
      // Fail-safe: Inquiry is already successfully saved to MongoDB Atlas!
    }

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      emailSent,
      emailError: emailErrorMsg,
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
      if (["new", "contacted", "responded", "closed", "reviewed", "archived"].includes(st)) {
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

