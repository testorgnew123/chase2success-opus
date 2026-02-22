const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Compress an image file to fit under maxSize (default 10 MB).
 * Uses canvas to re-encode the image at progressively lower JPEG quality.
 * If the image is already under maxSize, returns it unchanged.
 */
export async function compressImage(
  file: File,
  maxSize: number = MAX_SIZE
): Promise<File> {
  if (file.size <= maxSize) return file;

  const img = await loadImage(file);
  const qualities = [0.85, 0.7, 0.55, 0.4, 0.3];

  for (const quality of qualities) {
    const compressed = await canvasToFile(img, img.width, img.height, quality, file.name);
    if (compressed.size <= maxSize) return compressed;
  }

  // Final fallback: scale down the image dimensions while keeping quality reasonable
  let scale = 0.9;
  while (scale > 0.3) {
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const compressed = await canvasToFile(img, w, h, 0.4, file.name);
    if (compressed.size <= maxSize) return compressed;
    scale -= 0.1;
  }

  // Absolute last resort: heavily scale down
  const w = Math.round(img.width * 0.3);
  const h = Math.round(img.height * 0.3);
  return canvasToFile(img, w, h, 0.3, file.name);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
}

function canvasToFile(
  img: HTMLImageElement,
  width: number,
  height: number,
  quality: number,
  fileName: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    // Use high-quality image smoothing when downscaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        const compressed = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(compressed);
      },
      "image/jpeg",
      quality
    );
  });
}
