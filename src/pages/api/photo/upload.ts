import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { uploadImageToCloudinary, uploadVideoToCloudinary, isVideo } from '@/utils/cloudinaryUploader';

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
      maxFileSize: 60 * 1024 * 1024, // 60MB limit
      multiples: false,
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      let uploadedFile = files.photo;
      if (Array.isArray(uploadedFile)) {
        uploadedFile = uploadedFile[0];
      }

      if (!uploadedFile || Array.isArray(uploadedFile)) {
        return res.status(400).json({ error: 'No file or invalid file format' });
      }

      try {
        const filePath = uploadedFile.filepath;
        let cloudinaryUrl: string;

        if (isVideo(uploadedFile.mimetype)) {
          cloudinaryUrl = await uploadVideoToCloudinary(filePath);
        } else {
          cloudinaryUrl = await uploadImageToCloudinary(filePath);
        }

        // Clean up temporary file
        fs.unlinkSync(filePath);

        return res.status(200).json({ 
          message: 'Upload successful',
          url: cloudinaryUrl,
          type: isVideo(uploadedFile.mimetype) ? 'video' : 'image'
        });
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ error: 'Cloudinary upload failed' });
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
