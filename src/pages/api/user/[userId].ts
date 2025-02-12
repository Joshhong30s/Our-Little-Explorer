// src/pages/api/user/[userId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from '@/types/users';
import dbConnect from '@/utils/dbConnect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('userId API route init');
  await dbConnect();

  const { userId } = req.query;

  if (req.method === 'PUT') {
    try {
      console.log('userId:', userId);
      const { image } = req.body;

      // 更新 database
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { image },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res
        .status(200)
        .json({ message: '頭像更新成功', user: updatedUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '更新失敗' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
