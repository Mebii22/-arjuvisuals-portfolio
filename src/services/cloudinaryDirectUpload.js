import { API_CONFIG, apiRequest } from "./api.js";
import { compressImageFile } from "../utils/imageUtils.js";
import { saveDeviceVideoFile } from "../utils/videoStorage.js";

export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
export const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "mov", "webm", "ogg"];

/**
 * Formats bytes to human-readable string (e.g. 14.5 MB)
 */
export function formatFileSizeMB(bytes) {
  if (!bytes || bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

/**
 * Validates a media file for size and type before initiating upload
 * @param {File} file
 * @param {"video" | "image" | "auto"} expectedType
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateMediaFile(file, expectedType = "auto") {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const name = file.name || "";
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type || "";

  const isVideo =
    expectedType === "video" ||
    mime.startsWith("video/") ||
    ALLOWED_VIDEO_EXTENSIONS.includes(ext);

  if (isVideo) {
    // 1. File size limit for video: 100 MB
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      const currentMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `This video is ${currentMB} MB. The maximum allowed video size is 100 MB.`,
      };
    }

    // 2. Format validation for video
    const isAllowedVideo =
      ALLOWED_VIDEO_EXTENSIONS.includes(ext) ||
      mime.includes("mp4") ||
      mime.includes("quicktime") ||
      mime.includes("webm");

    if (!isAllowedVideo) {
      return {
        valid: false,
        error: "Unsupported video format. Please upload an MP4, MOV, or WEBM video.",
      };
    }

    return { valid: true, resourceType: "video" };
  } else {
    // 1. File size limit for images: 20 MB
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      const currentMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `This image is ${currentMB} MB. The maximum allowed image size is 20 MB.`,
      };
    }

    // 2. Format validation for images
    const isAllowedImage =
      ALLOWED_IMAGE_EXTENSIONS.includes(ext) ||
      mime.startsWith("image/");

    if (!isAllowedImage) {
      return {
        valid: false,
        error: "Unsupported image format. Please upload a JPG, JPEG, PNG, or WEBP image.",
      };
    }

    return { valid: true, resourceType: "image" };
  }
}

/**
 * Securely uploads a file directly from the browser to Cloudinary.
 * Obtains an upload authorization signature from the backend (admin-protected)
 * and streams the file directly to Cloudinary's servers, completely bypassing
 * the Render backend to eliminate request-size limits, latency, and timeouts.
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} [options.onProgress] - Receives percent completed (0 to 100)
 * @param {"video" | "image" | "auto"} [options.resourceType="auto"]
 * @returns {Promise<{ url: string, public_id?: string, bytes?: number, duration?: number }>}
 */
export async function uploadDirectToCloudinary(file, { onProgress, resourceType = "auto" } = {}) {
  // Step 1: Pre-upload client validation
  const validation = validateMediaFile(file, resourceType);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const determinedType = validation.resourceType || (resourceType === "video" ? "video" : "image");

  // Step 2: In API mode, use secure backend signature + direct Cloudinary stream
  if (API_CONFIG.USE_API) {
    if (onProgress) onProgress(0);

    // Request secure upload signature from backend (admin-authenticated)
    let signRes;
    try {
      signRes = await apiRequest("/upload/sign", {
        method: "POST",
        body: JSON.stringify({
          resourceType: determinedType,
          folder: "arjuvisuals",
        }),
      });
    } catch (err) {
      throw new Error(err.message || "Could not obtain upload authorization from server.");
    }

    const { signature, timestamp, apiKey, cloudName, folder } = signRes.data || {};
    if (!signature || !apiKey || !cloudName) {
      throw new Error("Invalid upload credentials received from server.");
    }

    // Step 3: Stream file directly from browser to Cloudinary with real-time progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${determinedType}/upload`;

      xhr.open("POST", endpoint);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.min(Math.round((event.loaded / event.total) * 100), 99);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (onProgress) onProgress(100);
            resolve({
              url: data.secure_url || data.url,
              public_id: data.public_id,
              bytes: data.bytes,
              format: data.format,
              duration: data.duration,
            });
          } catch {
            reject(new Error("Unable to parse Cloudinary response."));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            const msg = errData?.error?.message || `Upload failed with status ${xhr.status}`;
            reject(new Error(msg));
          } catch {
            reject(new Error(`Cloudinary upload failed (HTTP ${xhr.status}).`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network connection error during upload. Please check your internet and retry."));
      };

      xhr.ontimeout = () => {
        reject(new Error("Upload timed out. Please check your internet connection and retry."));
      };

      // Set generous timeout for large uploads (5 minutes)
      xhr.timeout = 5 * 60 * 1000;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      xhr.send(formData);
    });
  } else {
    // Step 4: Standalone / local mock fallback if backend is offline
    if (determinedType === "video") {
      if (onProgress) onProgress(30);
      const res = await saveDeviceVideoFile(file);
      if (onProgress) onProgress(100);
      return {
        url: res.uri,
        previewUrl: res.objectUrl,
        name: res.fileName,
        bytes: res.fileSize,
      };
    } else {
      if (onProgress) onProgress(50);
      const dataUrl = await compressImageFile(file, 1600, 1600, 0.85);
      if (onProgress) onProgress(100);
      return {
        url: dataUrl,
        bytes: file.size,
      };
    }
  }
}
