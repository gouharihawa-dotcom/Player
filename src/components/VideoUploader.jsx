import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileVideo,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Film,
} from 'lucide-react';
import { useVideoUpload } from '../hooks/useVideoUpload.js';

export default function VideoUploader({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const selectedFileRef = useRef(null);

  const {
    status,
    progress,
    error,
    fileInfo,
    selectFile,
    startUpload,
    cancelUpload,
    reset,
  } = useVideoUpload((metadata) => {
    onUploadSuccess(metadata);
    setTimeout(reset, 2000);
  });

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        selectedFileRef.current = file;
        selectFile(file);
      }
    },
    [selectFile]
  );

  const handleUpload = useCallback(() => {
    if (selectedFileRef.current && status === 'selected') {
      startUpload(selectedFileRef.current);
    }
  }, [status, startUpload]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        selectedFileRef.current = file;
        selectFile(file);
      }
    },
    [selectFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const isUploading = status === 'uploading';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isSelected = status === 'selected';
  const isIdle = status === 'idle';

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {isIdle && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary rounded-xl p-10 cursor-pointer transition-colors bg-surface/50 hover:bg-surface text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-text mb-2">
              Upload Your Video
            </h3>
            <p className="text-text-muted text-sm mb-4">
              Drag and drop a file here, or click to browse
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Film className="w-3.5 h-3.5" /> MP4
              </span>
              <span className="flex items-center gap-1">
                <Film className="w-3.5 h-3.5" /> WebM
              </span>
              <span className="flex items-center gap-1">
                <Film className="w-3.5 h-3.5" /> MOV
              </span>
            </div>
          </motion.div>
        )}

        {(isSelected || isUploading || isSuccess || isError) && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileVideo className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-text font-medium text-sm truncate">
                    {fileInfo?.name}
                  </h4>
                  {!isUploading && !isSuccess && (
                    <button
                      onClick={reset}
                      className="text-text-muted hover:text-text transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {isUploading && (
                    <button
                      onClick={cancelUpload}
                      className="text-text-muted hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-text-muted text-xs mb-3">
                  {fileInfo?.formattedSize} &bull; {fileInfo?.type}
                </p>

                {/* Progress */}
                <div className="relative h-2 bg-border rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {isUploading && (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading... {progress}%
                      </span>
                    )}
                    {isSuccess && (
                      <span className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Upload completed successfully
                      </span>
                    )}
                    {isError && (
                      <span className="flex items-center gap-1.5 text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                      </span>
                    )}
                    {isSelected && <span>Ready to upload</span>}
                  </span>

                  {isSelected && (
                    <button
                      onClick={handleUpload}
                      className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Start Upload
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
