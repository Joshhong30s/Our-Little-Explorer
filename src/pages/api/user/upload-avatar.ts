import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

import path from 'path';
import fs from 'fs';
import dbConnect from '@/utils/dbConnect';
import { UserModel } from '@/types/users';
import { uploadImageToCloudinary } from '@/utils/cloudinaryUploader';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('upload-avatar API route init');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 2 * 1024 * 1024,
      multiples: false,
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: '檔案上傳失敗' });
      }

      const userId = fields.userId as string;

      if (!userId) {
        return res.status(400).json({ error: '缺少 userId' });
      }

      let avatarFile = files.avatar;
      if (Array.isArray(avatarFile)) {
        avatarFile = avatarFile[0];
      }
      if (!avatarFile || Array.isArray(avatarFile)) {
        console.log('avatarFile is invalid => returning 400');
        return res.status(400).json({ error: '沒有檔案或檔案格式錯誤' });
      }

      try {
        const filePath = avatarFile.filepath;
        const cloudinaryUrl = await uploadImageToCloudinary(filePath);

        await UserModel.findByIdAndUpdate(userId, {
          image: cloudinaryUrl,
        });

        fs.unlinkSync(filePath);

        return res
          .status(200)
          .json({ message: '上傳成功', url: cloudinaryUrl });
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ error: 'Cloudinary 上傳失敗' });
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
