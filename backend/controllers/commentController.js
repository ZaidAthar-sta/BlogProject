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

const getCommentCount = async (req, res) => {
  try {
    console.log("→ Fetching posts for comment counts");

    const posts = await postModel.find({}, "_id");
    const counts = await Promise.all(
      posts.map(async ({ _id }) => ({
        postId: _id.toString(),
        count: await commentModel.countDocuments({ post: _id }),
      }))
    );

    const result = {};
    counts.forEach(({ postId, count }) => (result[postId] = count));

    return res.json(result);
  } catch (err) {
    console.error("❌ Error in getCommentCount:", err);
    return res.status(500).json({ error: "Failed to fetch comment counts" });
  }
};

export { createComment, getComments, getCommentCount };
