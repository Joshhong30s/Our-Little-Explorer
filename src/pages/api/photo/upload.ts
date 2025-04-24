import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { uploadMediaToCloudinary, isVideo } from '@/utils/cloudinaryUploader';

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
      maxFileSize: 100 * 1024 * 1024, // 100MB
      multiples: false,
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error('Form parse error:', {
          error: err,
          contentType: req.headers['content-type']
        });
        return res.status(500).json({ 
          error: 'File upload failed',
          details: err.message 
        });
      }

      const file = files.photo;
      if (!file) {
        return res.status(400).json({ 
          error: 'No file provided' 
        });
      }

      try {
        // Read file as buffer
        const fileBuffer = fs.readFileSync(file.filepath);
        const base64Data = fileBuffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64Data}`;
        
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadMediaToCloudinary(dataURI);
        
        // Clean up temp file
        fs.unlinkSync(file.filepath);

        return res.status(200).json({
          url: cloudinaryUrl,
          type: isVideo(file.mimetype) ? 'video' : 'image',
          originalName: file.originalFilename
        });
      } catch (error: any) {
        // Clean up temp file in case of error
        if (file.filepath && fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
        
        console.error('Upload error:', error);
        return res.status(500).json({
          error: 'Upload failed',
          details: error.message
        });
      }
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
}
