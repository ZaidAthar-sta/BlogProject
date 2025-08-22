import postModel from "../models/postModel.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";


const createPost = async (req, res) => {
    try {
        const { title, body, category, isPublished } = req.body;
        const userId = req.user.userId;
        const file = req.file;

    if (!title || !body || !category || !file) {
      return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
    }
    
    // Upload from buffer using upload_stream
    const uploadImageToCloudinary = () => {
      return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
          {
              folder: "blog-posts",
            resource_type: "image",
        },
          (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
        );
        stream.end(file.buffer);
    });
    };

    const uploadResult = await uploadImageToCloudinary();
    
    const newPost = await postModel.create({
      title,
      body,
      category,
      imageUrl: uploadResult.secure_url,
      author: userId,
      isPublished: isPublished || false,
    });
    
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
}
};

// const createPost = async (req, res) => {
//   try {
//     const { title, body, category, isPublished } = req.body;
//     const userId = req.user.userId;
//     const imageUrl = req.file;
//     // if (!imageUrl) {
//     //   return res.json({ success: false, message: "All fields are required" });
//     // }

//     let imageURL = null;
//     if (imageUrl) {
//       try {
//         const response = await cloudinary.uploader.upload(imageUrl.path, {
//           folder: "blog-posts",
//           resource_type: "image",
//         });
//         imageURL = response.secure_url;

//         fs.unlinkSync(imageUrl.path);
//       } catch (err) {
//         console.error("Upload failed:", err);
//         return res
//           .status(500)
//           .json({ success: false, message: "Image upload failed" });
//       }
//     }

//     const newPost = await postModel.create({
//       title,
//       body,
//       category,
//       imageUrl: imageURL,
//       author: userId,
//       isPublished: isPublished || false,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post: newPost,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deletepost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await post.remove();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updatepost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { title, body, isPublished } = req.body;

    const post = await postModel.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    post.title = title || post.title;
    post.body = body || post.body;
    if (typeof isPublished !== "undefined") post.isPublished = isPublished;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await postModel
      .findById(postId)
      .populate("author", "name email");

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await postModel
      .findById(postId)
      .populate("author", "name email") // Include author details
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name", // Populate comment author name
        },
      });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/postController.js
const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await postModel
      .find({ category })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error("Error fetching category posts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export {
  createPost,
  updatepost,
  deletepost,
  getAllPosts,
  getPostById,
  getSinglePost,
  getPostsByCategory
};
