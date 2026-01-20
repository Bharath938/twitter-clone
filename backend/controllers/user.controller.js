import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { searchUserService } from "../services/service.js";

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("Error in getUser controller", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchUsers = async (req, res) => {
  console.log(req.query);
  try {
    const { q, cursor, limit } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({
        users: [],
        nextCursor: null,
      });
    }

    const result = await searchUserService({
      q: q.trim(),
      cursor,
      limit,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ searchUsers error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) return res.status(400).json({ error: "User not found" });

    const filteredUsers = await User.find({
      _id: {
        $ne: currentUser._id,
        $nin: currentUser.following,
      },
    });
    const suggestedUsers = filteredUsers.slice(0, 4);

    res.status(200).json(suggestedUsers);
  } catch (err) {
    console.log("Error in getSuggestedUsers controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const currentUser = await User.findById({ _id: req.user._id });
    const userToModify = await User.findById({ _id: id });
    if (!userToModify || !currentUser)
      return res.status(404).json({ error: "User not found" });

    if (id === currentUser._id.toString())
      return res
        .status(400)
        .json({ error: "You can not follow or Unfollow yourself" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: id },
      });
      return res.status(200).json({ message: "Unfollowed Successfully" });
    } else {
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: id },
      });

      const notification = new Notification({
        from: currentUser._id,
        to: userToModify._id,
        type: "follow",
      });

      await notification.save();

      return res.status(200).json({ message: "Followed Successfully" });
    }
  } catch (err) {
    console.log("Error in followUnfollowUser controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullName, username, email, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    let user = await User.findOne({ _id: userId });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = cloudinary.uploader.upload(profileImg);
      profileImg = (await uploadedResponse).secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = cloudinary.uploader.upload(coverImg);
      coverImg = (await uploadedResponse).secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.log("Error in updateUser controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
