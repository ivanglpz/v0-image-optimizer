"use client";

import { ImagePreview } from "@/components/image-preview";
import { ImageUploadZone } from "@/components/image-upload-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  optimized?: string;
  originalSize: number;
  optimizedSize?: number;
}

export function ImageOptimizer() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState([30]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = useCallback((files: File[]) => {
    const newImages: ImageFile[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
        if (image.optimized) {
          URL.revokeObjectURL(image.optimized);
        }
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleOptimize = async () => {
    setIsProcessing(true);

    const optimizedImages = await Promise.all(
      images.map(async (image) => {
        const optimizedBlob = await optimizeImage(image.file, quality[0]);
        const optimizedUrl = URL.createObjectURL(optimizedBlob);

        // Clean up old optimized URL if exists
        if (image.optimized) {
          URL.revokeObjectURL(image.optimized);
        }

        return {
          ...image,
          optimized: optimizedUrl,
          optimizedSize: optimizedBlob.size,
        };
      })
    );

    setImages(optimizedImages);
    setIsProcessing(false);
  };

  const handleDownloadAll = () => {
    images.forEach((image) => {
      if (image.optimized) {
        const link = document.createElement("a");
        link.href = image.optimized;
        link.download = `optimized-${image.file.name}`;
        link.click();
      }
    });
  };

  const handleClearAll = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
      if (image.optimized) {
        URL.revokeObjectURL(image.optimized);
      }
    });
    setImages([]);
  };

  if (!images?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="w-full md:w-96 md:flex-shrink-0 space-y-6">
          <ImageUploadZone onFilesAdded={handleFilesAdded} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full h-full overflow-y-scroll md:overflow-hidden">
      {/* Left column: Upload zone and settings */}
      <div className="w-full md:w-96 md:flex-shrink-0 space-y-6">
        <ImageUploadZone onFilesAdded={handleFilesAdded} />

        {images.length > 0 && (
          <Card className="p-6 bg-card">
            <div className="space-y-6">
              <div className="flex flex-row gap-2 justify-between pb-4 border-b border-border">
                <section className="flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust compression settings for all images
                  </p>
                </section>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="gap-2 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quality" className="text-sm font-medium">
                      Quality
                    </Label>
                    <span className="text-sm font-mono text-muted-foreground">
                      {quality[0]}%
                    </span>
                  </div>
                  <Slider
                    id="quality"
                    min={1}
                    max={100}
                    step={1}
                    value={quality}
                    onValueChange={setQuality}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher quality means larger file size. Recommended: 80-90%
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleOptimize}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing
                    ? "Processing..."
                    : `Optimize ${images.length} Image${
                        images.length !== 1 ? "s" : ""
                      }`}
                </Button>
                {images.some((img) => img.optimized) && (
                  <Button
                    variant="outline"
                    onClick={handleDownloadAll}
                    className="w-full gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Right column: Image previews with scroll */}
      {images.length > 0 && (
        <div className="w-full flex h-full flex-col gap-4 md:flex-row md:flex-wrap md:overflow-y-scroll">
          {images.map((image) => (
            <ImagePreview
              key={image.id}
              image={image}
              onRemove={handleRemoveImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

async function optimizeImage(file: File, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          quality / 100
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
