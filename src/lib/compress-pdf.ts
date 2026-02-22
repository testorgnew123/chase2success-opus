import * as pdfjsLib from "pdfjs-dist";
import { jsPDF } from "jspdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Compresses a PDF by rendering pages to canvas and rebuilding with JPEG compression.
 * Tries progressively lower quality until the file is under maxSize.
 */
export async function compressPdf(
  file: File,
  maxSize: number = MAX_SIZE
): Promise<File> {
  // If already under limit, return as-is
  if (file.size <= maxSize) return file;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  // Try different quality levels until we get under the limit
  const qualities = [0.7, 0.5, 0.35, 0.2];
  const scale = 1.5; // render at 1.5x for decent quality

  for (const quality of qualities) {
    const doc = new jsPDF({ unit: "pt" });

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const imgData = canvas.toDataURL("image/jpeg", quality);

      if (i > 1) {
        doc.addPage([viewport.width, viewport.height]);
      } else {
        // Set first page size
        doc.internal.pageSize.setWidth(viewport.width);
        doc.internal.pageSize.setHeight(viewport.height);
      }

      doc.addImage(imgData, "JPEG", 0, 0, viewport.width, viewport.height);
    }

    const blob = doc.output("blob");

    if (blob.size <= maxSize) {
      return new File([blob], file.name, { type: "application/pdf" });
    }
  }

  // Last resort: lower scale + lowest quality
  const doc = new jsPDF({ unit: "pt" });
  const lowScale = 1.0;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: lowScale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgData = canvas.toDataURL("image/jpeg", 0.15);

    if (i > 1) {
      doc.addPage([viewport.width, viewport.height]);
    } else {
      doc.internal.pageSize.setWidth(viewport.width);
      doc.internal.pageSize.setHeight(viewport.height);
    }

    doc.addImage(imgData, "JPEG", 0, 0, viewport.width, viewport.height);
  }

  const blob = doc.output("blob");
  return new File([blob], file.name, { type: "application/pdf" });
}
