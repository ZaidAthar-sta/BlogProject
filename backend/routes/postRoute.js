import express from "express";
const postRoute = express.Router();
import {
  createPost,
  updatepost,
  deletepost,
  getAllPosts,
  getPostById,
  getSinglePost,
  getPostsByCategory
} from "../controllers/postController.js";
import userAuth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

postRoute.post("/create", userAuth, upload.single("image"), createPost);
postRoute.post("/update/:id", userAuth, updatepost);
postRoute.post("/delete/:id", userAuth, deletepost);
postRoute.get("/all", getAllPosts);
postRoute.get("/:id", userAuth, getSinglePost);
postRoute.get("/category/:category", getPostsByCategory)

export default postRoute;
