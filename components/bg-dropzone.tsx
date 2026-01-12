"use client";

import { Wand2 } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface BgDropzoneProps {
  onDrop: (files: File[]) => void;
  disabled?: boolean;
}

export interface BgDropzoneRef {
  openFileSelector: () => void;
}

export const BgDropzone = forwardRef<BgDropzoneRef, BgDropzoneProps>(
  ({ onDrop, disabled }, ref) => {
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      disabled,
    });

    useImperativeHandle(ref, () => ({
      openFileSelector: open,
    }));

    return (
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-8 sm:p-12 text-center transition-colors cursor-pointer",
          "hover:border-muted-foreground/50 hover:bg-muted/50 active:scale-[0.98]",
          isDragActive && "border-primary bg-muted",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-muted p-3 sm:p-4 transition-colors group-hover:bg-muted-foreground/10">
            <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop your images here" : "Drag your images here"}
            </p>
            <p className="text-xs text-muted-foreground">or click to select</p>
          </div>
        </div>
      </div>
    );
  },
);

BgDropzone.displayName = "BgDropzone";
