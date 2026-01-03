# Image Optimizer

## Overview

Image Optimizer is a client-side web application built with Next.js and React that allows users to compress and optimize images directly in the browser. The application focuses on simplicity, performance, and privacy: all image processing happens locally using browser APIs, and no files are uploaded to a server.

The main goal of the application is to reduce image file size while preserving acceptable visual quality, making it suitable for web delivery, documentation, and general asset optimization.

---

## Key Features

- Drag-and-drop and file picker image upload
- Support for multiple images in a single session
- Global quality control applied to all images
- Real-time image preview (original and optimized)
- Size comparison and percentage savings per image
- Bulk optimization and bulk download
- Individual image download
- Light and dark theme with system preference support
- Fully client-side processing (no backend required)

---

## How the Application Works

### High-Level Flow

1. The user uploads one or more image files using the upload zone.
2. The application creates local object URLs to preview the images.
3. The user adjusts the compression quality using a slider.
4. When the user triggers optimization, each image is processed sequentially:

   - The file is read into memory.
   - The image is drawn onto a canvas element.
   - The canvas is re-encoded as a JPEG blob using the selected quality.

5. Optimized images are displayed alongside original metadata.
6. The user can download individual optimized images or all images at once.

All operations occur in memory and within the browser runtime.

---

## Architecture and Design

### Framework and Runtime

- Next.js (App Router)
- React (Client Components)
- TypeScript

The application uses the Next.js App Router with client components for all interactive logic. There is no server-side image processing.

### State Management

State is managed locally within React components using `useState` and `useCallback`. The primary state includes:

- Uploaded image metadata and object URLs
- Global compression quality value
- Processing state (to disable actions during optimization)

The design avoids shared global state and keeps logic scoped to the components that own it.

### Image Processing Strategy

Image optimization is implemented using standard browser APIs:

- `FileReader` to read image data
- `HTMLImageElement` for decoding
- `HTMLCanvasElement` for rendering
- `canvas.toBlob()` for JPEG re-encoding with adjustable quality

This approach ensures:

- No external dependencies for image compression
- Predictable behavior across modern browsers
- No network usage for processing

---

## Component Breakdown

### `ImageOptimizer`

The core component responsible for:

- Managing the list of uploaded images
- Storing quality settings
- Coordinating optimization and download actions
- Rendering the main layout (settings + previews)

This component also contains the `optimizeImage` function, which encapsulates the canvas-based compression logic.

### `ImageUploadZone`

Handles user input for images:

- Drag-and-drop support
- File input fallback
- File type filtering to images only

Emits selected files upward without performing any processing.

### `ImagePreview`

Displays per-image information:

- Preview image (original or optimized)
- Original and optimized file sizes
- Percentage savings
- Download and remove actions

Each preview is fully independent and driven by props.

### UI Components

Reusable UI primitives such as buttons, cards, labels, and sliders are implemented using:

- Radix UI primitives
- Tailwind CSS
- Class Variance Authority for styling variants

These components are generic and not coupled to image-specific logic.

---

## Styling and Theming

### Styling System

- Tailwind CSS for utility-first styling
- CSS variables for color tokens
- Shared design tokens for light and dark themes

### Theme Management

- Light and dark themes are supported
- System preference is respected on first load
- User preference is persisted in `localStorage`

The theme is applied by toggling a `dark` class on the root HTML element.

---

## Performance Considerations

- Object URLs are revoked when images are removed or cleared to avoid memory leaks
- Optimization runs asynchronously to keep the UI responsive
- Processing state disables actions during active compression

Because processing is client-side, performance depends on device capabilities and image resolution.

---

## Limitations and Constraints

- Images are re-encoded as JPEG regardless of original format
- Metadata such as EXIF is not preserved
- Very large images may impact performance on low-end devices
- No server-side or batch background processing

These constraints are deliberate to keep the application simple and dependency-free.

---

## Project Structure

```
app/
  layout.tsx        # Application layout and metadata
  page.tsx          # Main entry page
  globals.css       # Global styles and design tokens

components/
  image-optimizer.tsx
  image-upload-zone.tsx
  image-preview.tsx
  theme-provider.tsx
  theme-toggle.tsx
  ui/               # Reusable UI primitives

lib/
  utils.ts          # Shared utility functions

styles/
  globals.css       # Theme and base styles
```

---

## Development and Scripts

### Install Dependencies

```
npm install
```

### Run Development Server

```
npm run dev
```

### Build for Production

```
npm run build
```

### Start Production Server

```
npm run start
```

---

## Intended Use Cases

- Compressing images before uploading to websites
- Reducing asset size for documentation or presentations
- Quick local optimization without external tools
- Demonstrating client-side image processing techniques

---

## Summary

Image Optimizer is a lightweight, fully client-side image compression tool built with modern React and Next.js. Its design prioritizes clarity, performance, and privacy, while remaining easy to extend or adapt for more advanced image workflows in the future.
