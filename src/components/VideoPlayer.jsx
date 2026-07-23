import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useVideoPlayer } from "../hooks/useVideoPlayer.js";
import PlayerControls from "./PlayerControls.jsx";

export default function VideoPlayer({ video, onBack }) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideControlsTimerRef = useRef(null);

  const {
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
  } = useVideoPlayer(video.id, video.lastPosition || 0);

  const handleVideoClick = useCallback(
    (e) => {
      if (e.target.tagName === "VIDEO") {
        togglePlay();
      }
    },
    [togglePlay],
  );

  const showControls = useCallback(() => {
    setControlsVisible(true);

    if (hideControlsTimerRef.current) {
      window.clearTimeout(hideControlsTimerRef.current);
    }

    if (isPlaying) {
      hideControlsTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 2000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
        hideControlsTimerRef.current = null;
      }
      return;
    }

    if (controlsVisible) {
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
      hideControlsTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 2000);
    }

    return () => {
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
        hideControlsTimerRef.current = null;
      }
    };
  }, [isPlaying, controlsVisible]);

  const takeScreenshot = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement || videoElement.readyState < 2) return;

    const width = videoElement.videoWidth || videoElement.clientWidth;
    const height = videoElement.videoHeight || videoElement.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(videoElement, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `screenshot-${video.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [video.id, videoRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-darker"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-text font-medium text-sm truncate flex-1">
          {video.name || video.fileName}
        </h1>
      </div>

      {/* Player */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div
          className="video-player-container relative bg-black rounded-xl overflow-hidden aspect-video group"
          onClick={handleVideoClick}
          onPointerMove={showControls}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 px-4 text-center">
              <div className="bg-surface border border-red-500 rounded-xl p-6 max-w-md text-red-200">
                <h2 className="text-white font-semibold text-lg mb-2">
                  Playback error
                </h2>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          )}

          {srcUrl && (
            <video
              ref={videoRef}
              src={srcUrl}
              className="w-full h-full"
              playsInline
            />
          )}

          {/* Controls */}
          <div
            className={`absolute inset-0 transition-opacity ${
              controlsVisible ? "opacity-100" : "opacity-0"
            } pointer-events-none`}
          >
            <div
              className="h-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <PlayerControls
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                isMuted={isMuted}
                isFullscreen={isFullscreen}
                playbackRate={playbackRate}
                buffered={buffered}
                onTogglePlay={togglePlay}
                onSeek={seek}
                onVolumeChange={changeVolume}
                onToggleMute={toggleMute}
                onToggleFullscreen={toggleFullscreen}
                onPlaybackRateChange={changePlaybackRate}
                onScreenshot={takeScreenshot}
              />
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-6 bg-surface border border-border rounded-xl p-5 ">
          <h2 className="text-text font-semibold text-lg mb-3">
            {video.name || video.fileName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-text-muted block text-xs mb-1">Size</span>
              <span className="text-text">
                {video.sizeFormatted || video.size}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-xs mb-1">Format</span>
              <span className="text-text">{video.fileType}</span>
            </div>
            <div>
              <span className="text-text-muted block text-xs mb-1">
                Date Added
              </span>
              <span className="text-text">
                {new Date(video.createdAt).toLocaleDateString("en-US")}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-xs mb-1">
                Storage Status
              </span>
              <span className="text-text">
                {video.keepForever ? (
                  <span className="text-primary">Permanent</span>
                ) : (
                  <span className="text-text-muted">Temporary</span>
                )}
              </span>
            </div>
          </div>
          {video.lastPosition > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-text-muted text-xs">
                Last playback position: {Math.floor(video.lastPosition / 60)}:
                {(video.lastPosition % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
