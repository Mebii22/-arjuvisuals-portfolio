const express = require("express");
const router = express.Router();

const protectAdmin = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const { getUploadSignature, uploadMedia } = require("../controllers/uploadController");

// Secure upload authorization route: POST /api/upload/sign (Direct-to-Cloudinary)
router.post("/sign", protectAdmin, getUploadSignature);

// Admin-protected server-streamed upload route: POST /api/upload
router.post("/", protectAdmin, handleUpload, uploadMedia);

module.exports = router;

