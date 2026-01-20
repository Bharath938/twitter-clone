import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user")
      .populate({ path: "comments.user" });

    if (allPosts.length === 0) return res.status(200).json([]);

    res.status(200).json(allPosts);
  } catch (err) {
    console.log("Error in getAllPosts controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const user = await User.findOne({ _id: req.user._id });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!text && !img)
      return res.status(400).json({ error: "Post must have text or Image" });

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: user._id,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.log("Error in createPost controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(id);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: user._id } },
        { new: true }
      );

      const updatedLikes = updatedPost.likes;

      return res.status(200).json(updatedLikes);
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          $push: { likes: user._id },
        },
        { new: true }
      );

      const notification = new Notification({
        from: user._id,
        to: post.user,
        type: "like",
      });

      await notification.save();
      const updatedLikes = updatedPost.likes;
      return res.status(200).json(updatedLikes);
    }
  } catch (err) {
    console.log("Error in likedPost controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const rePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "User not found" });

    const isReposted = post.rePosts.includes(user._id);

    if (isReposted) {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { rePosts: user._id } },
        { new: true }
      );

      return res.status(200).json(updatedPost);
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { rePosts: user._id } },
        { new: true }
      );
      return res.status(200).json(updatedPost);
    }
  } catch (err) {
    console.log("Error in likedPost controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getReposts = async (req, res) => {
  const { id: currentUserId } = req.params;
  const userId = req.user._id;
  try {
    const rePosts = await Post.find({ rePosts: currentUserId })
      .populate("user")
      .populate("comments.user");

    res.status(200).json(rePosts);
  } catch (err) {
    console.log("Error in getReposts controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You can not delete the other posts" });

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log("Error in deletePost controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    if (!text || !text.trim())
      return res
        .status(400)
        .json({ error: "Comment field should not be empty" });

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $push: { comments: { text, user: currentUser._id } },
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost)
      return res.status(400).json({ error: "Failed to create comment" });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log("Error in commentOnPost controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ likes: { $in: user._id } })
      .populate("user")
      .populate("comments.user");

    if (likePost.length === 0) return res.status(200).json([]);

    res.status(200).json(likedPosts);
  } catch (err) {
    console.log("Error in getLikedPosts controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const followingUsers = user.following;
    const feedPosts = await Post.find({ user: { $in: followingUsers } })
      .sort({
        createdAt: -1,
      })
      .populate("user")
      .populate("comments.user");

    res.status(200).json(feedPosts);
  } catch (err) {
    console.log("Error in getFollowingPosts controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const currentUser = await User.findById(id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: currentUser._id })
      .sort({ createAt: -1 })
      .populate("user")
      .populate("comments.user");

    res.status(200).json(posts);
  } catch (err) {
    console.log("Error in getFollowingPosts controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
