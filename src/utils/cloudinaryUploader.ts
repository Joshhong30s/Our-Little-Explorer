import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export async function uploadImageToCloudinary(
  filePath: string,
  folder: string = 'Baby'
) {
  const result = await cloudinary.v2.uploader.upload(filePath, {
    folder: folder,
  });
  return result.secure_url;
}

export async function uploadVideoToCloudinary(
  filePath: string,
  folder: string = 'Baby/videos'
) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'video',
      chunk_size: 20000000,
      eager: [
        {
          streaming_profile: 'hd',
          format: 'mp4',
        },
      ],
      eager_async: true,
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', {
      error,
      filePath,
    });
    throw error;
  }
}

export function isVideo(mimeType: string) {
  const videoMimeTypes = [
    'video/',
    'video/quicktime',
    'video/x-msvideo',
    'video/mp4',
    'video/x-matroska',
  ];
  return videoMimeTypes.some(type => mimeType?.toLowerCase().includes(type));
}
