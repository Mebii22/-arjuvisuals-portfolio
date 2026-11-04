const express = require("express");
const router = express.Router();
const {
  getPublicServices,
  getAllServicesAdmin,
  getServiceById,
  addService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const protectAdmin = require("../middleware/authMiddleware");

// Public route: Get published services
router.get("/", getPublicServices);

// Admin route: Get all services including drafts (Must come before /:id)
router.get("/admin/all", protectAdmin, getAllServicesAdmin);

// Public route: Get single service by ID
router.get("/:id", getServiceById);

// Admin routes: Create, update, delete
router.post("/", protectAdmin, addService);
router.put("/:id", protectAdmin, updateService);
router.delete("/:id", protectAdmin, deleteService);

module.exports = router;
