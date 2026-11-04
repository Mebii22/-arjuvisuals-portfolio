const express = require("express");
const router = express.Router();

const protectAdmin = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const { uploadMedia } = require("../controllers/uploadController");

// Admin-protected upload route: POST /api/upload
router.post("/", protectAdmin, handleUpload, uploadMedia);

module.exports = router;

