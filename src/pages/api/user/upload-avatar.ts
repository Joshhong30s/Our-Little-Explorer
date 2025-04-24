import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import dbConnect from '@/utils/dbConnect';
import { UserModel } from '@/types/users';
import { uploadMediaToCloudinary } from '@/utils/cloudinaryUploader';

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
      maxFileSize: 5 * 1024 * 1024, // 5MB limit for avatars
    });

    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }

      const file = files.avatar;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      try {
        // Read file as buffer and convert to base64
        const fileBuffer = fs.readFileSync(file.filepath);
        const base64Data = fileBuffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64Data}`;
        
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadMediaToCloudinary(dataURI);

        // Clean up temp file
        fs.unlinkSync(file.filepath);

        // Update user avatar in database
        await dbConnect();
        const userId = fields.userId;
        await UserModel.findByIdAndUpdate(userId, { image: cloudinaryUrl });

        return res.status(200).json({ 
          url: cloudinaryUrl
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
    return res.status(500).json({ error: error.message });
  }
}
