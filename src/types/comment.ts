import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'photos',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const CommentModel =
  mongoose.models.comments || mongoose.model('comments', CommentSchema);
