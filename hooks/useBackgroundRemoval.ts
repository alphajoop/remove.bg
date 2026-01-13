"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export type ProcessedImage = {
  file: File;
  preview: string;
  result?: string;
  status: "pending" | "processing" | "success" | "error";
  progress?: number;
  error?: string;
};

export const useBackgroundRemoval = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const addFiles = useCallback((files: File[]) => {
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
    }));
    setImages((prev) => [...prev, ...mapped]);
    if (files.length > 0) {
      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} added`,
      );
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const processAll = useCallback(async () => {
    setProcessing(true);
    const processed: ProcessedImage[] = [];
    const totalImages = images.length;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      setImages((prev) =>
        prev.map((image) =>
          image.file === img.file
            ? { ...image, status: "processing" as const, progress: 0 }
            : image,
        ),
      );

      const formData = new FormData();
      formData.append("image", img.file);

      try {
        const res = await fetch("/api/remove-bg", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          processed.push({
            ...img,
            status: "error",
            error: errorData.error || "Failed to process image",
          });
          toast.error(errorData.error || "Failed to process image");
        } else {
          const data = await res.json();
          processed.push({
            ...img,
            result: data.result,
            status: "success",
          });
          toast.success("Background removed successfully!");
        }
      } catch (error) {
        console.error(error);
        processed.push({
          ...img,
          status: "error",
          error: "Network error occurred",
        });
        toast.error("Network error occurred");
      }

      // Update progress
      const progress = Math.round(((i + 1) / totalImages) * 100);
      setImages((prev) =>
        prev.map((image) =>
          image.file === img.file ? { ...image, progress } : image,
        ),
      );
    }

    setImages(processed);
    setProcessing(false);

    // Show completion summary
    const successCount = processed.filter(
      (img) => img.status === "success",
    ).length;
    const errorCount = processed.filter((img) => img.status === "error").length;

    if (successCount > 0 && errorCount === 0) {
      toast.success(
        `All ${successCount} image${successCount > 1 ? "s" : ""} processed successfully!`,
      );
    } else if (errorCount > 0) {
      toast.warning(`${successCount} successful, ${errorCount} failed`);
    }
  }, [images]);

  const resetProcessed = useCallback(() => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        status: "pending" as const,
        result: undefined,
        error: undefined,
        progress: undefined,
      })),
    );
    toast.success("Images reset to initial state");
  }, []);

  const clearAll = useCallback(() => {
    setImages([]);
    toast.success("All images cleared");
  }, []);

  return {
    images,
    processing,
    addFiles,
    removeFile,
    processAll,
    clearAll,
    resetProcessed,
  };
};
