import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, index: true }, // S3 key o ruta local
    filename: { type: String, required: true },
    contentType: { type: String },
    size: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("File", FileSchema);
