import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import VideoLibrary from "./components/VideoLibrary.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import VideoUploader from "./components/VideoUploader.jsx";
import { useVideoLibrary } from "./hooks/useVideoLibrary.js";

export default function App() {
  const [currentView, setCurrentView] = useState("library"); // library, player, upload
  const [selectedVideo, setSelectedVideo] = useState(null);

  const {
    videos,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,

    removeVideo,
    savePermanently,
    addVideo,
  } = useVideoLibrary();

  const handlePlay = useCallback((video) => {
    setSelectedVideo(video);
    setCurrentView("player");
  }, []);

  const handleBack = useCallback(() => {
    setSelectedVideo(null);
    setCurrentView("library");
  }, []);

  const handleUploadSuccess = useCallback(
    (metadata) => {
      addVideo(metadata);
    },
    [addVideo],
  );

  return (
    <div className="min-h-screen bg-darker text-text">
      <AnimatePresence mode="wait">
        {currentView === "library" && (
          <VideoLibrary
            key="library"
            videos={videos}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onPlay={handlePlay}
            onDelete={removeVideo}
            onKeepForever={savePermanently}
            onUploadClick={() => setCurrentView("upload")}
          />
        )}

        {currentView === "player" && selectedVideo && (
          <VideoPlayer key="player" video={selectedVideo} onBack={handleBack} />
        )}

        {currentView === "upload" && (
          <div key="upload" className="min-h-screen bg-darker">
            <div className="max-w-2xl mx-auto px-4 py-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-text font-bold text-2xl mb-1">
                    Upload Video
                  </h1>
                  <p className="text-text-muted text-sm">
                    Select and upload your video file
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView("library")}
                  className="px-4 py-2 bg-surface hover:bg-surface-light text-text rounded-lg transition-colors text-sm"
                >
                  Back
                </button>
              </div>
              <VideoUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
