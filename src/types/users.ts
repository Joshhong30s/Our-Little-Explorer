import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: false, unique: true },
  password: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  image: { type: String, required: false },
  providers: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  savedPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
});

export const UserModel =
  mongoose.models.users || mongoose.model('users', UserSchema);
