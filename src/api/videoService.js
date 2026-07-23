import {
  saveVideoFile,
  getVideoFile,
  deleteVideoFile,
} from "../storage/indexedDB.js";

const META_KEY = "video-library-metadata";

function loadMetadata() {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMetadataMap(map) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(META_KEY, JSON.stringify(map));
}

function getMetadata(id) {
  const map = loadMetadata();
  return id ? map[id] : map;
}

function updateMetadataStore(id, updates) {
  const map = loadMetadata();
  const current = map[id];
  if (!current) {
    throw new Error(`Video metadata not found for id: ${id}`);
  }
  const updated = { ...current, ...updates };
  map[id] = updated;
  saveMetadataMap(map);
  return updated;
}

function addMetadata(metadata) {
  const map = loadMetadata();
  map[metadata.id] = metadata;
  saveMetadataMap(map);
  return metadata;
}

function removeMetadata(id) {
  const map = loadMetadata();
  if (map[id]) {
    delete map[id];
    saveMetadataMap(map);
  }
}

function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function extractVideoPreviewData(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    let timeoutId = null;

    const cleanup = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      video.pause();
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
    };

    const finalize = (duration, thumbnail) => {
      cleanup();
      resolve({ duration, thumbnail });
    };

    const captureThumbnail = (duration) => {
      const width = Math.min(320, video.videoWidth || 320);
      const height = Math.min(180, video.videoHeight || 180);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      let thumbnail = null;

      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, width, height);
          thumbnail = canvas.toDataURL("image/jpeg", 0.75);
        } catch {
          thumbnail = null;
        }
      }

      finalize(duration, thumbnail);
    };

    const handleSeeked = () => {
      captureThumbnail(video.duration || 0);
    };

    const handleLoadedMetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const captureTime = Math.min(1, Math.max(0.5, duration * 0.01));
      video.addEventListener("seeked", handleSeeked, { once: true });
      video.addEventListener("canplay", handleSeeked, { once: true });
      video.currentTime = captureTime;
      timeoutId = window.setTimeout(() => captureThumbnail(duration), 5000);
    };

    const handleError = () => {
      cleanup();
      resolve({ duration: 0, thumbnail: null });
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata, {
      once: true,
    });
    video.addEventListener("error", handleError, { once: true });
    video.load();
  });
}

export async function getVideos() {
  const metadata = getMetadata();
  return Object.values(metadata).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

export async function uploadVideo(file, onProgress) {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  onProgress?.(0);
  await saveVideoFile(id, file);

  const previewData = await extractVideoPreviewData(file).catch(() => ({
    duration: 0,
    thumbnail: null,
  }));

  const metadata = {
    id,
    fileName: file.name,
    name: file.name,
    size: file.size,
    sizeFormatted: formatSize(file.size),
    fileType: file.type || file.name.split(".").pop(),
    createdAt: new Date().toISOString(),
    keepForever: false,
    lastPosition: 0,
    lastPlayedAt: null,
    duration: previewData.duration || 0,
    thumbnail: previewData.thumbnail || null,
  };

  addMetadata(metadata);
  onProgress?.(100);

  return metadata;
}

export async function deleteVideo(id) {
  await deleteVideoFile(id);
  removeMetadata(id);
}

export async function keepVideoForever(id) {
  return updateMetadataStore(id, { keepForever: true });
}

export async function updateVideoMetadata(id, updates) {
  return updateMetadataStore(id, updates);
}

export async function getVideoBlobUrl(id) {
  const file = await getVideoFile(id);
  if (!file) return null;
  return URL.createObjectURL(file);
}

export function revokeVideoBlobUrl(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}
