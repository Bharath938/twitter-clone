import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: no token provided" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await User.findById({ _id: decode.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectedRoute middleware", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectedRoute;
