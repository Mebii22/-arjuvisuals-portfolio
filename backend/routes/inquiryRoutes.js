const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  markInquiryAsRead,
  getUnreadCount,
  deleteInquiry,
} = require("../controllers/inquiryController");
const protectAdmin = require("../middleware/authMiddleware");

// Public route: Any visitor can submit an inquiry
router.post("/", createInquiry);

// Admin-only routes: View, count, mark read, update status/notes, and delete
router.get("/", protectAdmin, getInquiries);
router.get("/unread-count", protectAdmin, getUnreadCount);
router.patch("/:id/read", protectAdmin, markInquiryAsRead);
router.put("/:id/read", protectAdmin, markInquiryAsRead);
router.get("/:id", protectAdmin, getInquiryById);
router.put("/:id", protectAdmin, updateInquiry);
router.delete("/:id", protectAdmin, deleteInquiry);

module.exports = router;

