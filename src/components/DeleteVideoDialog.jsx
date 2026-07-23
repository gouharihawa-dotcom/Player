import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteVideoDialog({ isOpen, videoName, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text mb-1">
                  Delete Video
                </h3>
                <p className="text-text-muted text-sm mb-4 break-all whitespace-normal">
                  Are you sure you want to delete "
                  <span className="text-text font-medium break-all whitespace-normal">{videoName}</span>"? This action cannot be undone.
                </p>
              </div>
              <button
                onClick={onCancel}
                className="text-text-muted hover:text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 bg-surface-light hover:bg-border text-text rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
