import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { PhotoModel } from '../../../types/photos';
import { UserModel } from '../../../types/users';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  const token = await getToken({ req, secret });
  let user;
  if (token?.id) {
    user = await UserModel.findById(token.id);
  } else if (token?.email) {
    user = await UserModel.findOne({ email: token.email });
  }

  if (method === 'GET') {
    const { action } = req.query;

    if (action === 'savedPhotos') {
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const savedPhotos = await PhotoModel.find({
        _id: { $in: user.savedPhotos },
      });
      return res.status(200).json({ savedPhotos });
    }

    const photos = await PhotoModel.find({});
    return res.status(200).json(photos);
  }

  if (method === 'POST') {
    const photo = await PhotoModel.create({ ...req.body, userOwner: user._id });
    return res.status(201).json(photo);
  }

  if (method === 'PUT') {
    const { photoID } = req.body;
    const photo = await PhotoModel.findById(photoID);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (!user.savedPhotos.includes(photoID)) {
      user.savedPhotos.push(photoID);
      await user.save();
    }

    return res.status(200).json({ savedPhotos: user.savedPhotos });
  }

  if (method === 'DELETE') {
    const { photoID } = req.body;

    if (!user.savedPhotos.includes(photoID)) {
      return res
        .status(404)
        .json({ message: 'Photo not found in savedPhotos' });
    }

    user.savedPhotos.pull(photoID);
    await user.save();
    return res.status(200).json({ savedPhotos: user.savedPhotos });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
