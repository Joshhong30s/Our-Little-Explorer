import mongoose, { Schema } from "mongoose";

// Define userSchema for MongoDB
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
});

export const UserModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
