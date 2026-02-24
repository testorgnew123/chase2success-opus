const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "chase2success";

/**
 * Optimize a Cloudinary image URL by injecting transformation parameters.
 * Converts to WebP/AVIF automatically, applies quality optimization,
 * and optionally constrains width for responsive delivery.
 *
 * @param url  - Raw Cloudinary secure_url from the database
 * @param opts - width: max width in px
 * @returns    - Optimized Cloudinary URL (or original if not a Cloudinary URL)
 */
export function optimizeCloudinaryUrl(
  url: string | null | undefined,
  opts: { width?: number } = {}
): string {
  if (!url) return "";
  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;

  const transforms = ["f_auto", "q_auto"];
  if (opts.width) transforms.push(`w_${opts.width}`, "c_limit");

  // Insert transforms after /upload/
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

export async function uploadToCloudinary(
  file: File,
  folder: string = "chase2success"
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Cloudinary upload error:", err);
      return null;
    }

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return null;
  }
}

export async function uploadFileToCloudinary(
  file: File,
  folder: string = "project-brochures"
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Cloudinary file upload error:", err);
      return null;
    }

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary file upload failed:", err);
    return null;
  }
}
