import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import { PhotoModel } from "../../../types/photos";
import { UserModel } from "../../../types/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  if (method === "GET") {
    const { action, userID } = req.query;

    if (action === "savedPhotos") {
      const user = await UserModel.findById(userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const savedPhotos = await PhotoModel.find({
        _id: { $in: user.savedPhotos },
      });
      return res.status(200).json({ savedPhotos });
    }

    const photos = await PhotoModel.find({});
    return res.status(200).json(photos);
  }

  if (method === "POST") {
    const photo = await PhotoModel.create(req.body);
    return res.status(201).json(photo);
  }

  if (method === "PUT") {
    const { photoID, userID } = req.body;
    const photo = await PhotoModel.findById(photoID);
    const user = await UserModel.findById(userID);

    if (!photo || !user) {
      return res.status(404).json({ message: "Photo or user not found" });
    }

    user.savedPhotos.push(photo);
    await user.save();
    return res.status(200).json({ savedPhotos: user.savedPhotos });
  }

  if (method === "DELETE") {
    const { photoID, userID } = req.body;
    const user = await UserModel.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedPhotos.pull(photoID);
    await user.save();
    return res.status(200).json({ savedPhotos: user.savedPhotos });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
