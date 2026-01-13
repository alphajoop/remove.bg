"use client";

import { Download, Trash2, Wand2 } from "lucide-react";
import { useRef } from "react";
import { BgDropzone, type BgDropzoneRef } from "@/components/bg-dropzone";
import { BgPreview } from "@/components/bg-preview";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function BackgroundRemovalPage() {
  const {
    images,
    processing,
    addFiles,
    removeFile,
    processAll,
    clearAll,
    resetProcessed,
  } = useBackgroundRemoval();
  const dropzoneRef = useRef<BgDropzoneRef>(null);

  const pendingCount = images.filter((img) => img.status === "pending").length;
  const successCount = images.filter((img) => img.status === "success").length;
  const processedCount = images.filter(
    (img) => img.status === "success" || img.status === "error",
  ).length;

  const downloadAll = () => {
    images.forEach((image) => {
      if (image.result) {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${image.result}`;
        link.download = `removed-bg-${image.file.name}`;
        link.click();
      }
    });
  };

  const handleSelectFiles = () => {
    dropzoneRef.current?.openFileSelector();
  };

  useKeyboardShortcuts({
    onProcessAll: processAll,
    onClearAll: clearAll,
    onSelectFiles: handleSelectFiles,
    isProcessing: processing,
    hasPendingImages: pendingCount > 0,
    hasImages: images.length > 0,
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Background Removal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Remove backgrounds from your images instantly
          </p>
        </div>

        {/* Dropzone */}
        <BgDropzone ref={dropzoneRef} onDrop={addFiles} disabled={processing} />

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                {images.length} image{images.length > 1 ? "s" : ""}
                {successCount > 0 && (
                  <span className="ml-1 text-foreground">
                    · {successCount} processed
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                {successCount > 0 && (
                  <button
                    type="button"
                    onClick={downloadAll}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3 w-3" />
                    Download all
                  </button>
                )}
                {processedCount > 0 && (
                  <button
                    type="button"
                    onClick={resetProcessed}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                    Reset processed
                  </button>
                )}
                {pendingCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, i) => (
                <BgPreview
                  key={`${img.file.name}-${i}`}
                  image={img}
                  index={i}
                  onRemove={removeFile}
                />
              ))}
            </div>
          </div>
        )}

        {/* Process Button */}
        {pendingCount > 0 && (
          <div className="mt-8">
            <Button
              onClick={processAll}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Remove background from {pendingCount} image
                  {pendingCount > 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <KeyboardShortcuts />
      </div>
    </main>
  );
}
