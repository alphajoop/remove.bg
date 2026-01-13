"use client";

import { AlertCircle, Check, Download, X } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Spinner } from "@/components/ui/spinner";
import type { ProcessedImage } from "@/hooks/useBackgroundRemoval";
import { cn } from "@/lib/utils";

interface BgPreviewProps {
  image: ProcessedImage;
  index: number;
  onRemove: (index: number) => void;
}

export function BgPreview({ image, index, onRemove }: BgPreviewProps) {
  const downloadImage = () => {
    if (image.result) {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${image.result}`;
      link.download = `removed-bg-${image.file.name}`;
      link.click();
    }
  };

  return (
    <div className="group relative">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-muted transition-all",
          image.status === "processing" && "opacity-70",
          image.status === "error" && "border-destructive",
        )}
      >
        <AspectRatio ratio={1}>
          <Image
            src={
              image.result
                ? `data:image/png;base64,${image.result}`
                : image.preview || "/placeholder.svg"
            }
            fill
            alt={image.file.name}
            className="object-cover"
          />
        </AspectRatio>

        {/* Status overlay */}
        {image.status === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Spinner className="h-5 w-5" />
          </div>
        )}

        {image.status === "success" && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <div className="rounded-full bg-primary p-1.5">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <button
              type="button"
              onClick={downloadImage}
              className="rounded-full bg-background/80 p-1.5 hover:bg-background"
            >
              <Download className="h-3 w-3 text-foreground" />
            </button>
          </div>
        )}

        {image.status === "error" && (
          <div className="absolute bottom-2 right-2">
            <div
              className="rounded-full bg-destructive p-1.5"
              title={image.error}
            >
              <AlertCircle className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        )}

        {/* Remove button */}
        {image.status === "pending" && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
          >
            <X className="h-3 w-3 text-foreground" />
          </button>
        )}
      </div>

      {/* File name */}
      <div className="mt-2">
        <p className="truncate text-xs text-muted-foreground">
          {image.file.name}
        </p>
      </div>
    </div>
  );
}
