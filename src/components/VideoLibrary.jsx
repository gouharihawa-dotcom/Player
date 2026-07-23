import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Grid3X3, List, Plus } from "lucide-react";
import VideoCard from "./VideoCard.jsx";
import VideoSearch from "./VideoSearch.jsx";
import LibraryFilters from "./LibraryFilters.jsx";
import DeleteVideoDialog from "./DeleteVideoDialog.jsx";

export default function VideoLibrary({
  videos,
  loading,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onPlay,
  onDelete,
  onKeepForever,
  onUploadClick,
}) {
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = (video) => {
    setDeleteTarget(video);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-darker">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-darker border-b border-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-text font-bold text-xl">Video Player</h1>
                <p className="text-text-muted text-xs">
                  {videos.length} {videos.length === 1 ? "video" : "videos"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
            <LibraryFilters sortBy={sortBy} onSortChange={setSortBy} />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <VideoSearch value={searchQuery} onChange={setSearchQuery} />
              <button
                onClick={onUploadClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Video</span>
              </button>
              <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-48 md:h-44" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4">
              <Film className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-text font-medium text-lg mb-2">
              No videos found
            </h3>
            <p className="text-text-muted text-sm mb-6 max-w-md">
              Upload your videos to see them in your library
            </p>
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Upload Video
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-3"
            }
          >
            <AnimatePresence>
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={onPlay}
                  onDelete={handleDelete}
                  onKeepForever={onKeepForever}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteVideoDialog
        isOpen={!!deleteTarget}
        videoName={deleteTarget?.name || deleteTarget?.fileName}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
