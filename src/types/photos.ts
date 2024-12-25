import mongoose, { Schema } from 'mongoose';

const PhotoSchema = new Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  instructions: { type: String, required: true },
  imageUrl: { type: String, required: false },
  growingTime: { type: Schema.Types.Mixed, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const PhotoModel =
  mongoose.models.photos || mongoose.model('photos', PhotoSchema);
