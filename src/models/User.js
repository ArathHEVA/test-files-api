import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true, uppercase: true },
    resetToken: { type: String },
    resetTokenExp: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
