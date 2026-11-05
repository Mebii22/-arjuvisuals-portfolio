const express = require("express");
const router = express.Router();
const { getPublicProfile, updateProfile } = require("../controllers/profileController");
const protectAdmin = require("../middleware/authMiddleware");

// Public route to view photographer profile
router.get("/", getPublicProfile);

// Protected route for admin to update profile
router.put("/", protectAdmin, updateProfile);

module.exports = router;

