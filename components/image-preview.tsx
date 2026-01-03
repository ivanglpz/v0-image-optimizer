"use client";

import type { ImageFile } from "@/components/image-optimizer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Download, X } from "lucide-react";

interface ImagePreviewProps {
  image: ImageFile;
  onRemove: (id: string) => void;
}

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const savings = image.optimizedSize
    ? Math.round(
        ((image.originalSize - image.optimizedSize) / image.originalSize) * 100
      )
    : 0;

  const handleDownload = () => {
    if (image.optimized) {
      const link = document.createElement("a");
      link.href = image.optimized;
      link.download = `optimized-${image.file.name}`;
      link.click();
    }
  };

  return (
    <Card className="overflow-hidden bg-card flex-shrink-0 py-0 w-full md:w-72 h-auto max-h-76 border-0 leading-7 gap-0">
      <div className="relative h-48 bg-muted">
        <img
          src={image.optimized || image.preview}
          alt={image.file.name}
          className="w-full h-full object-contain"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={() => onRemove(image.id)}
        >
          <X className="h-4 w-4" />
        </Button>
        {image.optimized && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Optimized
          </div>
        )}
      </div>
      <div className="p-4 space-y-2 py-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-card-foreground truncate">
            {image.file.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>{formatSize(image.originalSize)}</span>
            {image.optimizedSize && (
              <>
                <span>→</span>
                <span className="text-accent font-semibold">
                  {formatSize(image.optimizedSize)}
                </span>
                <span className="text-accent font-semibold">(-{savings}%)</span>
              </>
            )}
          </div>
        </div>
        {image.optimized && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-transparent"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </div>
    </Card>
  );
}
