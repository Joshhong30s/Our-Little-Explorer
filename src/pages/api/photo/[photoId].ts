import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { PhotoModel } from '../../../types/photos';
import { CommentModel } from '../../../types/comment';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { photoId } = req.query;

  if (req.method === 'GET') {
    try {
      const photo = await PhotoModel.findById(photoId).exec();
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      const comments = await CommentModel.find({ photo: photoId })
        .populate('user')
        .sort({ createdAt: -1 })
        .exec();
      return res.status(200).json({ photo, comments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
