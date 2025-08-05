import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../utils/dbConnect';
import { CommentModel } from '../../../../types/comment';
import { getToken } from 'next-auth/jwt';
import { validateAndSanitizeMessage } from '../../../../utils/sanitizer';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { photoId } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Missing comment text' });
  }
  
  // Validate and sanitize comment text
  const textValidation = validateAndSanitizeMessage(text);
  if (!textValidation.isValid) {
    return res.status(400).json({ 
      message: textValidation.error 
    });
  }

  try {
    const newComment = await CommentModel.create({
      photo: photoId,
      user: token.id,
      text: textValidation.sanitized,
    });

    const comments = await CommentModel.find({ photo: photoId })
      .populate('user')
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
