// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
}, { timestamps: true });

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;