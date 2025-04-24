import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
  isVideo,
} from '@/utils/cloudinaryUploader';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: serverRuntimeConfig.maxFileSize || 60 * 1024 * 1024,
      multiples: false,
      allowEmptyFiles: false,
      filter: part => {
        if (!part.mimetype) return false;
        return (
          part.name === 'photo' &&
          (part.mimetype.includes('image/') || part.mimetype.includes('video/'))
        );
      },
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        // Check if it's a file size error
        if (err.code === 'LIMIT_FILE_SIZE') {
          console.error('File size limit exceeded:', {
            error: err,
            contentLength: req.headers['content-length']
          });
          return res.status(413).json({ 
            error: 'File upload failed',
            details: `File size must be less than ${Math.floor(serverRuntimeConfig.maxFileSize / (1024 * 1024))}MB`
          });
        }
        
        console.error('Form parse error:', {
          error: err,
          contentType: req.headers['content-type'],
          contentLength: req.headers['content-length']
        });
        return res.status(500).json({ 
          error: 'File upload failed',
          details: err.message 
        });
      }

      let uploadedFile = files.photo;
      if (Array.isArray(uploadedFile)) {
        uploadedFile = uploadedFile[0];
      }

      if (!uploadedFile || Array.isArray(uploadedFile)) {
        console.error('File validation error:', {
          files: Object.keys(files),
          contentType: uploadedFile?.mimetype,
        });
        return res.status(400).json({
          error: 'No file or invalid file format',
          receivedFiles: Object.keys(files),
        });
      }

      try {
        const filePath = uploadedFile.filepath;
        const fileType = uploadedFile.mimetype;
        const fileSize = uploadedFile.size;

        console.log('Processing file:', {
          mimetype: fileType,
          originalFilename: uploadedFile.originalFilename,
          size: fileSize,
          path: filePath,
        });

        let cloudinaryUrl: string;
        const isVideoFile = isVideo(fileType);

        if (isVideoFile) {
          cloudinaryUrl = await uploadVideoToCloudinary(filePath);
        } else {
          cloudinaryUrl = await uploadImageToCloudinary(filePath);
        }

        // Clean up temporary file
        fs.unlinkSync(filePath);

        return res.status(200).json({
          message: 'Upload successful',
          url: cloudinaryUrl,
          type: isVideoFile ? 'video' : 'image',
          originalName: uploadedFile.originalFilename,
        });
      } catch (error: any) {
        console.error('Cloudinary Upload Error:', {
          error,
          file: {
            type: uploadedFile.mimetype,
            name: uploadedFile.originalFilename,
            size: uploadedFile.size,
          },
        });
        return res.status(500).json({
          error: 'Cloudinary upload failed',
          details: error.message,
          fileType: uploadedFile.mimetype,
        });
      }
    });
  } catch (error: any) {
    console.error('General error:', error);
    return res.status(500).json({
      error: error.message,
      type: 'general_error',
    });
  }
}
