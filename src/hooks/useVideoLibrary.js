import { useState, useEffect, useCallback } from "react";
import {
  getVideos,
  deleteVideo,
  keepVideoForever,
  updateVideoMetadata,
} from "../api/videoService.js";

export function useVideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVideos();
      setVideos(data || []);
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const removeVideo = useCallback(async (id) => {
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete video:", err);
      return false;
    }
  }, []);

  const savePermanently = useCallback(async (id) => {
    try {
      const updated = await keepVideoForever(id);
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, keepForever: true } : v)),
      );
      return updated;
    } catch (err) {
      console.error("Failed to keep video forever:", err);
      return null;
    }
  }, []);

  const updateMetadata = useCallback(async (id, updates) => {
    try {
      const updated = await updateVideoMetadata(id, updates);
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updates } : v)),
      );
      return updated;
    } catch (err) {
      console.error("Failed to update metadata:", err);
      return null;
    }
  }, []);

  const addVideo = useCallback((video) => {
    setVideos((prev) => [video, ...prev]);
  }, []);

  const filteredVideos = videos
    .filter((v) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.name?.toLowerCase().includes(q) ||
        v.fileName?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "lastPlayed":
          if (!a.lastPlayedAt) return 1;
          if (!b.lastPlayedAt) return -1;
          return new Date(b.lastPlayedAt) - new Date(a.lastPlayedAt);
        default:
          return 0;
      }
    });

  return {
    videos: filteredVideos,
    allVideos: videos,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    removeVideo,
    savePermanently,
    updateMetadata,
    addVideo,
    refresh: loadVideos,
  };
}
