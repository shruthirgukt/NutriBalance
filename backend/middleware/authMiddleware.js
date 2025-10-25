import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

// Middleware to verify JWT token
export const verifyToken = (role) => async (req, res, next) => {
  try {
    const cookieName = role === "Admin" ? "admintoken" : "usertoken";
    const token =
      req.cookies[cookieName] || req.headers.authorization?.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
