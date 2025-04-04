// src/pages/api/photo/recommendations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { PhotoModel } from '../../../types/photos';
import { generatePhotoRecommendations } from '@/mcp/protocols/recommendation/photoRecommendation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { photoId } = req.query;

  if (!photoId || typeof photoId !== 'string') {
    return res.status(400).json({ message: 'Photo ID is required' });
  }

  try {
    // Get the main photo
    const photo = await PhotoModel.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Get all photos for recommendations
    const allPhotos = await PhotoModel.find({});

    // Generate recommendations using MCP
    const recommendations = await generatePhotoRecommendations(
      photo.toObject(),
      allPhotos.map(p => p.toObject())
    );

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
