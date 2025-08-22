import userModel from "../models/userModel.js";
import commentModel from "../models/commentModel.js";
import postModel from "../models/postModel.js";

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user.userId; // assuming verifyToken sets req.user

    console.log("User ID from token:", req.user);

    // Check if the post exists
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Create and save comment
    const newComment = new commentModel({
      content,
      author: userId,
      post: postId,
    });

    await newComment.save();

    const populatedComment = await commentModel
      .findById(newComment._id)
      .populate("author", "name");

    await postModel.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res
      .status(201)
      .json({ message: "Comment added", comment: populatedComment });
  } catch (error) {}
};

const getComments = async (req, res) => {
  try {
    const comments = await commentModel
      .find({ post: req.params.postId })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    console.log("Populated comments:", comments);

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};


const getCommentsCount = async (req, res) => {
  try {
    const postId = req.params.postId;
    const count = await commentModel.countDocuments({ post: postId });
    res.json({ count });
  } catch (err) {
    console.error("Error fetching comments count:", err);
    res.status(500).json({ message: "Error fetching comments count" });
  }
};

export { createComment, getComments, getCommentsCount };
