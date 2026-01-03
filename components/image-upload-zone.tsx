"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useCallback } from "react";

interface ImageUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export function ImageUploadZone({ onFilesAdded }: ImageUploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        onFilesAdded(files);
      }
    },
    [onFilesAdded]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        onFilesAdded(files);
      }
      e.target.value = "";
    },
    [onFilesAdded]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card
      className="border-2 border-dashed border-border bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label htmlFor="file-upload" className="block cursor-pointer">
        <div className="p-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-base font-medium text-foreground">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              Support for JPG, PNG, WebP, and other image formats
            </p>
            <p className="text-xs text-muted-foreground">
              You can select multiple files at once
            </p>
          </div>
        </div>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={handleFileInput}
        />
      </label>
    </Card>
  );
}
