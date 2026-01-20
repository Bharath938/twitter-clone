import express from "express";
const router = express.Router();

import protectedRoute from "../middleware/protectedRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
  searchUsers,
} from "../controllers/user.controller.js";

router.get("/profile/:id", protectedRoute, getUserProfile);
router.get("/search", protectedRoute, searchUsers);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.patch("/update", protectedRoute, updateUser);

export default router;
