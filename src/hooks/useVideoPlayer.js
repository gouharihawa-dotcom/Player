import { useState, useRef, useCallback, useEffect } from "react";
import {
  updateVideoMetadata,
  getVideoBlobUrl,
  revokeVideoBlobUrl,
} from "../api/videoService.js";

export function useVideoPlayer(videoId, initialPosition = 0) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPosition);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);
  const [srcUrl, setSrcUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let currentUrl = null;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const url = await getVideoBlobUrl(videoId);
        currentUrl = url;
        if (mounted) {
          if (!url) {
            setError("Video file is unavailable.");
          }
          setSrcUrl(url);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load video.");
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
      if (currentUrl) revokeVideoBlobUrl(currentUrl);
    };
  }, [videoId]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setError(null);
      } catch (err) {
        setError(
          "Playback was blocked or failed. Try clicking the play button again.",
        );
      }
    } else {
      video.pause();
    }
  }, []);

  const seek = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback((vol) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const changePlaybackRate = useCallback((rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const savePosition = useCallback(
    (time) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        updateVideoMetadata(videoId, {
          lastPosition: Math.floor(time),
          lastPlayedAt: new Date().toISOString(),
        });
      }, 2000);
    },
    [videoId],
  );

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    savePosition(video.currentTime);
  }, [savePosition]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    if (initialPosition > 0 && initialPosition < video.duration) {
      video.currentTime = initialPosition;
    }
  }, [initialPosition]);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.buffered.length) return;
    setBuffered(video.buffered.end(video.buffered.length - 1));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !srcUrl) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("progress", handleProgress);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("progress", handleProgress);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [srcUrl, handleTimeUpdate, handleLoadedMetadata, handleProgress]);

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    playbackRate,
    buffered,
    srcUrl,
    loading,
    error,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    toggleFullscreen,
    changePlaybackRate,
  };
}
