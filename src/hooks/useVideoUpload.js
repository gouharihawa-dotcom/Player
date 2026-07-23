import { useState, useCallback, useRef } from 'react';
import { uploadVideo } from '../api/videoService.js';

export function useVideoUpload(onSuccess) {
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const abortRef = useRef(false);

  const selectFile = useCallback((file) => {
    if (!file) return;
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setError('Invalid file format. Only MP4, WebM, and MOV are supported.');
      setStatus('error');
      return;
    }
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop(),
      formattedSize: formatSize(file.size),
    });
    setStatus('selected');
    setError(null);
    setProgress(0);
  }, []);

  const startUpload = useCallback(
    async (file) => {
      if (!file) return;
      abortRef.current = false;
      setStatus('uploading');
      setProgress(0);
      setError(null);

      try {
        const metadata = await uploadVideo(file, (p) => {
          if (!abortRef.current) setProgress(p);
        });

        if (abortRef.current) {
          setStatus('idle');
          setProgress(0);
          return;
        }

        setStatus('success');
        setProgress(100);
        if (onSuccess) onSuccess(metadata);
        return metadata;
      } catch (err) {
        if (!abortRef.current) {
          setError(err.message || 'Upload failed');
          setStatus('error');
        }
      }
    },
    [onSuccess]
  );

  const cancelUpload = useCallback(() => {
    abortRef.current = true;
    setStatus('idle');
    setProgress(0);
  }, []);

  const reset = useCallback(() => {
    abortRef.current = false;
    setStatus('idle');
    setProgress(0);
    setError(null);
    setFileInfo(null);
  }, []);

  return {
    status,
    progress,
    error,
    fileInfo,
    selectFile,
    startUpload,
    cancelUpload,
    reset,
  };
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
