const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} = require("../controllers/inquiryController");
const protectAdmin = require("../middleware/authMiddleware");

// Public route: Any visitor can submit an inquiry
router.post("/", createInquiry);

// Admin-only routes: View, inspect, update status/notes, and delete
router.get("/", protectAdmin, getInquiries);
router.get("/:id", protectAdmin, getInquiryById);
router.put("/:id", protectAdmin, updateInquiry);
router.delete("/:id", protectAdmin, deleteInquiry);

module.exports = router;

