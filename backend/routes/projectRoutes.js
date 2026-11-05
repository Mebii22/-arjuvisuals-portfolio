const express = require("express");
const router = express.Router();

const {
  addProject,
  getPublishedProjects,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protectAdmin = require("../middleware/authMiddleware");

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all published projects (supports query params: ?category=... & ?featured=true)
router.get("/", getPublishedProjects);

// ==========================================
// ADMIN-PROTECTED ROUTES
// ==========================================

// Get all projects including drafts
// NOTE: Must be declared before /:id so Express does not treat "admin" as an ID param
router.get("/admin/all", protectAdmin, getAllProjects);

// Create a new project (draft by default)
router.post("/", protectAdmin, addProject);

// ==========================================
// ID-BASED ROUTES
// ==========================================

// Get a single project by slug or MongoDB ID (Public)
router.get("/slug/:id", getSingleProject);
router.get("/:id", getSingleProject);

// Update an existing project (Admin only)
router.put("/:id", protectAdmin, updateProject);

// Delete a project (Admin only)
router.delete("/:id", protectAdmin, deleteProject);

module.exports = router;

