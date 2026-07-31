import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Gauge,
  Camera,
} from "lucide-react";
import { useState } from "react";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  playbackRate,
  buffered,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onPlaybackRateChange,
  onScreenshot,
}) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferProgress = duration ? (buffered / duration) * 100 : 0;
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-10 z-30">
      {/* Progress bar */}
      <div className="relative mb-3 group">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full"
            style={{ width: `${bufferProgress}%` }}
          />
          <div
            className="h-full bg-primary rounded-full absolute top-0 left-0 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer group-hover:opacity-100"
          style={{ top: "-6px", height: "16px" }}
        />
        <div
          className="absolute top-0 h-1 bg-primary rounded-full pointer-events-none group-hover:h-1.5 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls row */}
     <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
           className="p-1 sm:p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          <button
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            className="p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="flex items-center gap-2 group">
            <button
              onClick={onToggleMute}
             className="p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              {isMuted || volume === 0 ? (
               <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
            <div className="w-0 overflow-hidden group-hover:w-16 sm:group-hover:w-20 transition-all duration-300">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-14 sm:w-16"
              />
            </div>
          </div>

          <span className="text-white text-[10px] sm:text-xs md:text-sm font-mono mr-1 sm:mr-2 whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

       <div className="flex items-center gap-1 sm:gap-2">
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white text-sm"
            >
              <Gauge className="w-4 h-4" />
              <span>{playbackRate}x</span>
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-2 right-0 bg-surface-light border border-border rounded-lg shadow-xl overflow-hidden min-w-[80px] z-50">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onPlaybackRateChange(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-sm transition-colors ${
                      playbackRate === s
                        ? "bg-primary text-white"
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onScreenshot}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            title="Take screenshot"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}  