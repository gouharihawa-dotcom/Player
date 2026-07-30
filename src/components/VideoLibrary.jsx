import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Grid3X3,
  List,
  Plus,
  Menu,
  X,
} from "lucide-react";

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
  const [viewMode, setViewMode] = useState("grid");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-darker border-b border-border shadow-md">
        <div className="flex items-center gap-3 px-4 py-3">

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-surface transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>

          <Film className="w-6 h-6 text-primary" />

          <div>
            <h1 className="text-text font-bold text-lg">
              Video Player
            </h1>

            <p className="text-text-muted text-xs">
              {videos.length} {videos.length === 1 ? "video" : "videos"}
            </p>
          </div>

        </div>
      </div>


      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />


            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25 }}
              className="
                fixed top-0 left-0 bottom-0
                w-72
                bg-darker
                z-50
                border-r border-border
                pt-20 px-4
              "
            >

              <div className="space-y-4">

                <VideoSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                />


                <LibraryFilters
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />


                <button
                  onClick={onUploadClick}
                  className="
                  w-full flex items-center justify-center gap-2
                  px-4 py-3
                  bg-primary
                  text-white
                  rounded-lg
                  "
                >
                  <Plus className="w-4 h-4"/>
                  Upload Video
                </button>


                <div className="flex gap-2">

                  <button
                    onClick={() => setViewMode("grid")}
                    className="flex-1 p-3 bg-surface rounded-lg"
                  >
                    <Grid3X3 className="mx-auto w-5 h-5"/>
                  </button>


                  <button
                    onClick={() => setViewMode("list")}
                    className="flex-1 p-3 bg-surface rounded-lg"
                  >
                    <List className="mx-auto w-5 h-5"/>
                  </button>

                </div>

              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>


      {/* Space for fixed navbar */}
      <div className="h-16" />


      {/* Videos */}
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
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg"
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