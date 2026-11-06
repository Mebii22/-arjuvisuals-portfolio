const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * @desc    Generate secure signature for direct client-to-Cloudinary uploads
 *          Large video and photo files stream directly from the browser to Cloudinary,
 *          bypassing the Render backend to prevent timeouts and request-size limits.
 * @route   POST /api/upload/sign
 * @access  Private (Admin only)
 */
const getUploadSignature = async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary credentials are not configured on the server.",
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.body.folder || "arjuvisuals";
    const resourceType = req.body.resourceType === "video" ? "video" : "auto";

    // Parameters signed with CLOUDINARY_API_SECRET (secret is NEVER sent to frontend)
    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder,
        resourceType,
      },
    });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate upload authorization signature.",
      error: error.message,
    });
  }
};

/**
 * @desc    Upload an image or video file to Cloudinary (Server-streamed fallback)
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
        message: "This file exceeds Cloudinary's size limit. Maximum allowed size is 100 MB for videos and 20 MB for images.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Media upload failed. Please verify Cloudinary credentials and network connection.",
    });
  }
};

module.exports = { getUploadSignature, uploadMedia };

