import { motion } from "framer-motion";
import {
  Calendar,
  HardDrive,
  Infinity,
  Trash2,
  Shield,
} from "lucide-react";

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US");
}

function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoCard({ video, onPlay, onDelete, onKeepForever }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-video bg-darker cursor-pointer overflow-hidden bg-cover bg-center"
        onClick={() => onPlay(video)}
        style={
          video.thumbnail
            ? { backgroundImage: `url(${video.thumbnail})` }
            : undefined
        }
      >
        {!video.thumbnail && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-lg shadow-primary/20">
              <svg viewBox="0 0 48 48" className="w-7 h-7" aria-hidden="true">
                <rect
                  x="6"
                  y="6"
                  width="36"
                  height="36"
                  rx="10"
                  fill="white"
                  opacity="0.12"
                />
                <path d="M18 14 L18 34 L34 24 Z" fill="white" />
                <rect
                  x="29"
                  y="18"
                  width="3"
                  height="12"
                  rx="1.5"
                  fill="white"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white font-mono">
          {formatDuration(video.duration)}
        </div>
        {video.keepForever && (
          <div className="absolute top-2 left-2 bg-primary/90 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
            <Infinity className="w-3 h-3" />
            <span>Permanent</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3
          className="text-text font-medium text-sm mb-2 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onPlay(video)}
        >
          {video.name || video.fileName}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{video.sizeFormatted || video.size}</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
         
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {!video.keepForever && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onKeepForever(video.id);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-surface-light hover:bg-primary/20 text-text-muted hover:text-primary rounded-lg transition-colors text-xs font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Keep</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(video);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-surface-light hover:bg-red-500/20 text-text-muted hover:text-red-400 rounded-lg transition-colors text-xs font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
