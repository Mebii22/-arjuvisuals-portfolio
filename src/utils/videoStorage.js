/**
 * Video Storage Utility using browser IndexedDB.
 * Allows Arjun to upload video files directly from his device (MP4, WebM, MOV)
 * without hitting localStorage 5MB size limits, and plays them smoothly in HTML5 player.
 */

const DB_NAME = "arjuvisuals_media_db";
const DB_VERSION = 1;
const STORE_NAME = "videos";

// In-memory cache for active blob URLs
const blobUrlCache = new Map();

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this environment."));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores a video File or Blob into IndexedDB.
 * Returns an internal URI (idb://vid_...) and an active object URL for immediate playback.
 */
export async function saveDeviceVideoFile(file) {
  if (!file) throw new Error("No file provided.");

  const id = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const objectUrl = URL.createObjectURL(file);
  const internalUri = `idb://${id}`;

  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const record = {
        id,
        blob: file,
        name: file.name || "video.mp4",
        type: file.type || "video/mp4",
        size: file.size || 0,
        createdAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });

    blobUrlCache.set(internalUri, objectUrl);
    return {
      uri: internalUri,
      objectUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  } catch (err) {
    console.warn("Could not save to IndexedDB, falling back to session blob URL:", err);
    blobUrlCache.set(internalUri, objectUrl);
    return {
      uri: objectUrl,
      objectUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  }
}

/**
 * Resolves any video URL.
 * If given an idb:// URI, fetches the blob from IndexedDB and returns an active playable URL.
 */
export async function resolveVideoUrl(url) {
  if (!url || typeof url !== "string") return "";

  if (url.startsWith("idb://")) {
    if (blobUrlCache.has(url)) {
      return blobUrlCache.get(url);
    }

    try {
      const db = await openDB();
      const id = url.replace("idb://", "");
      const record = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (record && record.blob) {
        const activeUrl = URL.createObjectURL(record.blob);
        blobUrlCache.set(url, activeUrl);
        return activeUrl;
      }
    } catch (err) {
      console.warn("Failed to load video from IndexedDB:", err);
    }
  }

  return url;
}

/**
 * Formats bytes to readable MB/GB.
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
