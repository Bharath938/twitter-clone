import express from "express";
import protectedRoute from "../middleware/protectedRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getReposts,
  getUserPosts,
  likePost,
  rePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/likedPosts/:id", protectedRoute, getLikedPosts);
router.get("/user/:id", protectedRoute, getUserPosts);
router.get("/rePosts/:id", protectedRoute, getReposts);
router.post("/rePost/:id", protectedRoute, rePost);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/:id", protectedRoute, deletePost);

export default router;
