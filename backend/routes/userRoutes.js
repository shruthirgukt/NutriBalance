import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  getItems,
  getUserDetails,
} from "../controller/userController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/items", getItems);
userRouter.get("/me", verifyToken("User"), getUserDetails);

userRouter.put("/update", verifyToken("User"), updateUser);

export default userRouter;
