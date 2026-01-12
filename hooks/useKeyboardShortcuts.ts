"use client";

import { useCallback, useEffect } from "react";

export const useKeyboardShortcuts = ({
  onProcessAll,
  onClearAll,
  onSelectFiles,
  isProcessing,
  hasPendingImages,
  hasImages,
}: {
  onProcessAll: () => void;
  onClearAll: () => void;
  onSelectFiles: () => void;
  isProcessing: boolean;
  hasPendingImages: boolean;
  hasImages: boolean;
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + Enter: Process all images
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "Enter" &&
        hasPendingImages &&
        !isProcessing
      ) {
        event.preventDefault();
        onProcessAll();
      }

      // Ctrl/Cmd + O: Open file selector
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "o" &&
        !isProcessing
      ) {
        event.preventDefault();
        onSelectFiles();
      }

      // Escape: Clear all images
      if (event.key === "Escape" && hasImages && !isProcessing) {
        event.preventDefault();
        onClearAll();
      }
    },
    [
      onProcessAll,
      onClearAll,
      onSelectFiles,
      isProcessing,
      hasPendingImages,
      hasImages,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};
