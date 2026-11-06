const multer = require("multer");
const path = require("path");

// Configure memory storage so files are held in buffer before streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter for photography images and videography videos
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedExtensions = /^\.(jpg|jpeg|png|webp|mp4|mov|webm)$/i;
  const ext = path.extname(file.originalname).toLowerCase();

  // Allowed MIME types
  const allowedMimeTypes = [
    // Photography image formats
    "image/jpeg",
    "image/png",
    "image/webp",
    // Videography video formats
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ];

  const isExtAllowed = allowedExtensions.test(ext);
  const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);

  if (isExtAllowed && isMimeAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Supported formats: Images (JPG, JPEG, PNG, WEBP) and Videos (MP4, MOV, WEBM)."
      ),
      false
    );
  }
};

// Initialize multer with 100MB limit and memory storage
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max file size
  },
  fileFilter,
});

// Middleware wrapper to catch Multer and format errors cleanly in JSON
const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "This file is too large. The maximum allowed file size is 100 MB for videos and 20 MB for images.",
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

module.exports = { handleUpload };

