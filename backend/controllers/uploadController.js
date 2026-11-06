const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * @desc    Upload an image or video file to Cloudinary
 * @route   POST /api/upload
 * @access  Private (Admin only)
 */
const uploadMedia = async (req, res) => {
  try {
    // Check if file was provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please attach a file under the field name 'file'.",
      });
    }

    // Determine resource type: video or image
    const isVideo = req.file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    // Stream upload directly from memory buffer to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "arjuvisuals",
            resource_type: resourceType,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const result = await uploadToCloudinary();

    res.status(200).json({
      success: true,
      message: `${isVideo ? "Video" : "Image"} uploaded successfully`,
      url: result.secure_url,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    if (error.message && (error.message.toLowerCase().includes("file size") || error.http_code === 400)) {
      return res.status(400).json({
        success: false,
        message: "This file is too large. Please upload a file smaller than 10 MB.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Media upload failed. Please verify Cloudinary credentials and network connection.",
    });
  }
};

module.exports = { uploadMedia };

