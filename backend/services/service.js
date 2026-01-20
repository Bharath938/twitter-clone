import User from "../models/user.model.js";
import mongoose from "mongoose";

export const searchUserService = async ({ q, cursor, limit }) => {
  const safeLimit = Math.min(Number(limit) || 10, 20);

  // 🔐 Base filter
  const filter = {
    $text: { $search: q }, // ✅ STRING ONLY
  };

  // 🔁 Cursor pagination
  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    filter._id = { $gt: cursor };
  }

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { username: { $regex: q, $options: "i" } },
    ],
  }).limit(Number(limit));
  let nextCursor = null;

  if (users.length > safeLimit) {
    nextCursor = users[safeLimit]._id;
    users.pop();
  }

  return { users, nextCursor };
};
