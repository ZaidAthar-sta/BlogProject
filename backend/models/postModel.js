// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: String },
    imageUrl: { type: String }, // optional: for post images
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);
export default postModel;
