import express from "express";
import {
  registerAdmin,
  loginAdmin,
  updateAdminProfile,
  addCategory,
  addItem,
  getAllCategories,
  getAllItems,
  updateItem,
  deleteItem,
  addNutritionInfo,
  getCategoryById,
  updateCategory,
  deleteCategory,
  logoutAdmin,
} from "../controller/adminController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

// Public routes
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
// Protected admin routes
adminRouter.put("/profile", verifyToken("Admin"), isAdmin, updateAdminProfile);
adminRouter.post("/category", verifyToken("Admin"), isAdmin, addCategory);
adminRouter.post("/item", verifyToken("Admin"), isAdmin, addItem);
adminRouter.put("/category/:id", verifyToken("Admin"), isAdmin, updateCategory);
adminRouter.delete("/category/:id", verifyToken("Admin"), deleteCategory);
adminRouter.put("/item/:itemId", verifyToken("Admin"), updateItem);
adminRouter.get("/items", verifyToken("Admin"), getAllItems);
adminRouter.get("/categories", verifyToken("Admin"), getAllCategories);
adminRouter.delete("/item/:itemId", verifyToken("Admin"), deleteItem);
adminRouter.post(
  "/item/:itemId/nutrition",
  verifyToken("Admin"),
  addNutritionInfo
);
adminRouter.get("/category/:id", verifyToken("Admin"), getCategoryById);
export default adminRouter;
