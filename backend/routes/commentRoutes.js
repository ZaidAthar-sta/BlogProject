import express from "express";
import userAuth from "../middlewares/auth.js";
const commentRoute = express.Router();
import { createComment, getComments, getCommentCount } from "../controllers/commentController.js";

commentRoute.post("/:postId", userAuth, createComment);
commentRoute.get("/:postId", getComments);
commentRoute.get("/counts",getCommentCount);

export default commentRoute;
