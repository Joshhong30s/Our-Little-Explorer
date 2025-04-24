export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

export function isVideo(mimeType: string) {
  const videoMimeTypes = [
    'video/',          // general video
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/mp4',       // .mp4
    'video/x-matroska' // .mkv
  ];
  return videoMimeTypes.some(type => mimeType?.toLowerCase().includes(type));
}

export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || '');
  formData.append('folder', isVideo(file.type) ? 'Baby/videos' : 'Baby/images');

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function uploadMediaToCloudinary(input: string) {
  const formData = new FormData();
  formData.append('file', input);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || '');
  formData.append('folder', 'Baby');

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
