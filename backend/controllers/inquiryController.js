const mongoose = require("mongoose");
const Inquiry = require("../models/Inquiry");
const { BrevoClient } = require("@getbrevo/brevo");

/**
 * Helper to safely send admin email notification in the background via Brevo HTTP API.
 * Uses Brevo HTTPS REST API (port 443) to avoid cloud SMTP connection timeouts.
 * Employs strict error boundaries so failure never affects visitor UX or inquiry creation.
 */
const sendInquiryNotificationEmail = async (inquiry) => {
  try {
    const apiKey = (process.env.BREVO_API_KEY || "").trim();
    const senderEmail = (process.env.BREVO_SENDER_EMAIL || "").trim();
    const senderName = (process.env.BREVO_SENDER_NAME || "ArjuVisuals Portfolio").trim();
    const adminEmail = (process.env.ADMIN_EMAIL || senderEmail || "arjuvisuals.co@gmail.com").trim();

    if (!apiKey || !senderEmail) {
      console.warn(
        "[Inquiry] Brevo email notification skipped: BREVO_API_KEY or BREVO_SENDER_EMAIL is not configured."
      );
      return false;
    }

    const brevo = new BrevoClient({ apiKey, timeoutInSeconds: 15 });

    const customerName = (inquiry.name || "").trim() || "Valued Client";
    const customerEmail = (inquiry.email || "").trim();
    const customerPhone = (inquiry.phone || "").trim() || "Not provided";
    const serviceName = (inquiry.service || "").trim() || "General Inquiry";
    const timeline = (inquiry.eventDate || "").trim() || "Flexible / TBC";
    const location = (inquiry.location || "").trim() || "Not specified";
    const budget = (inquiry.budget || "").trim() || "Not specified";
    const messageContent = (inquiry.message || "").trim();

    const inquiryTimestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const subject = `New Inquiry from ${customerName} — ArjuVisuals.co`;

    const textContent = `
New Inquiry Received — ArjuVisuals.co
Date & Time: ${inquiryTimestamp}

Customer Name: ${customerName}
Customer Email: ${customerEmail}
Customer Phone: ${customerPhone}
Requested Service: ${serviceName}
Date / Timeline: ${timeline}
Location: ${location}
Estimated Budget: ${budget}

Customer Message:
${messageContent}

---
Reply directly to this email to reply to ${customerName} (${customerEmail}).
`.trim();

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1a202c; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #004643; padding-bottom: 14px; margin-bottom: 20px;">
          <h2 style="color: #004643; margin: 0; font-size: 20px; letter-spacing: -0.02em;">New Inquiry Received — ArjuVisuals.co</h2>
          <p style="color: #718096; margin: 6px 0 0; font-size: 13px;">Date &amp; Time: ${inquiryTimestamp}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: 600; width: 140px; color: #4a5568;">Customer Name:</td><td style="padding: 10px 0; color: #1a202c; font-weight: 600;">${customerName}</td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: 600; color: #4a5568;">Customer Email:</td><td style="padding: 10px 0;"><a href="mailto:${customerEmail}" style="color: #004643; font-weight: 500; text-decoration: underline;">${customerEmail}</a></td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: 600; color: #4a5568;">Customer Phone:</td><td style="padding: 10px 0;"><a href="tel:${customerPhone}" style="color: #004643;">${customerPhone}</a></td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: 600; color: #4a5568;">Requested Service:</td><td style="padding: 10px 0; font-weight: 600; color: #004643;">${serviceName}</td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: 600; color: #4a5568;">Date / Timeline:</td><td style="padding: 10px 0; color: #1a202c;">${timeline}</td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: 600; color: #4a5568;">Location:</td><td style="padding: 10px 0; color: #1a202c;">${location}</td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; font-weight: 600; color: #4a5568;">Estimated Budget:</td><td style="padding: 10px 0; color: #1a202c;">${budget}</td></tr>
        </table>

        <div style="margin-top: 16px;">
          <h3 style="color: #004643; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Customer Message:</h3>
          <div style="background: #f7fafc; padding: 16px; border-left: 4px solid #004643; border-radius: 4px; white-space: pre-line; font-size: 14px; line-height: 1.6; color: #2d3748;">
            ${messageContent}
          </div>
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #edf2f7; font-size: 12px; color: #718096;">
          💡 <em>Click <strong>Reply</strong> in your mail client to reply directly to <strong>${customerName}</strong> at <strong>${customerEmail}</strong>.</em>
        </div>
      </div>
    `;

    const sendPayload = {
      subject,
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: adminEmail,
          name: "Arjun Murali",
        },
      ],
      replyTo: {
        email: customerEmail || senderEmail,
        name: customerName,
      },
      textContent,
      htmlContent,
    };

    const response = await brevo.transactionalEmails.sendTransacEmail(sendPayload);
    const messageId = response?.messageId || "sent";
    console.log(`[Inquiry] Notification email sent successfully via Brevo to ${adminEmail} (messageId: ${messageId})`);
    return true;
  } catch (err) {
    const errorDetails = err?.response?.body?.message || err?.body?.message || err?.message || String(err);
    console.warn(`[Inquiry] Background email notification failed via Brevo: ${errorDetails}`);
    return false;
  }
};

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
      isRead: false,
      notes: "",
    });

    const safeInquiry = {
      id: inquiry._id,
      _id: inquiry._id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      service: inquiry.service,
      eventDate: inquiry.eventDate,
      location: inquiry.location,
      budget: inquiry.budget,
      message: inquiry.message,
      status: inquiry.status,
      isRead: false,
      createdAt: inquiry.createdAt,
    };

    // STEP 3: Immediately return a successful API response to visitor
    // Prevents button from ever freezing on "Saving inquiry..."
    res.status(201).json({
      success: true,
      message: "Your inquiry has been received successfully.",
      inquiry: safeInquiry,
      data: safeInquiry,
      emailSent: false,
    });

    // STEP 4: Attempt to send admin email notification in background (fail-safe)
    setImmediate(() => {
      sendInquiryNotificationEmail(inquiry).catch((emailErr) => {
        console.warn("[Inquiry] Background email notification failed:", emailErr.message);
      });
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
    if (req.query.status && ["new", "contacted", "responded", "closed", "reviewed", "archived"].includes(req.query.status.toLowerCase())) {
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
    if (req.body.isRead !== undefined) {
      updateData.isRead = Boolean(req.body.isRead);
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
 * @desc    Mark a specific inquiry as read/viewed (Admin only)
 *          Automatically marks the inquiry as read without changing its contact status.
 * @route   PATCH /api/inquiries/:id/read
 * @access  Private (Admin)
 */
const markInquiryAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID format",
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry marked as read",
      data: inquiry,
    });
  } catch (error) {
    console.error("Mark Inquiry As Read Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while marking inquiry as read",
    });
  }
};

/**
 * @desc    Get count of unread inquiries for notification badge (Admin only)
 * @route   GET /api/inquiries/unread-count
 * @access  Private (Admin)
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Inquiry.countDocuments({
      $or: [{ isRead: false }, { isRead: { $exists: false } }],
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get Unread Count Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while counting unread inquiries",
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
  markInquiryAsRead,
  getUnreadCount,
  deleteInquiry,
};

