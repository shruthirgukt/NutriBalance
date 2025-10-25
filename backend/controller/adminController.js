import User from "../model/userSchema.js";
import Category from "../model/categorySchema.js";
import Item from "../model/itemSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.ENVI === "production",
  sameSite: process.env.ENVI === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Admin registration
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "Admin",
    });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admintoken", token, COOKIE_OPTIONS);

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, username, email, role: admin.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const admin = await User.findOne({ email, role: "Admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admintoken", token, COOKIE_OPTIONS);

    res.json({
      message: "Admin logged in successfully",
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedAdmin = await User.findByIdAndUpdate(adminId, updates, {
      new: true,
    });

    res.json({ message: "Admin profile updated", updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required" });

    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // category ID from URL
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Find the category and update
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all items related to this category
    await Item.deleteMany({ category: id });

    // Delete the category itself
    await category.deleteOne();

    res
      .status(200)
      .json({ message: "Category and its items deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

// Add item under category with images
export const addItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, images, nutrition } =
      req.body;

    if (!name || !price || !categoryId || !nutrition)
      return res
        .status(400)
        .json({ message: "Name, price, and category required" });

    // No need to upload images again
    const item = await Item.create({
      name,
      description,
      price,
      category: categoryId,
      images: images || [], // just save the URLs sent from frontend
      nutrition,
      createdBy: req.user.id,
    });

    res
      .status(201)
      .json({ success: true, message: "Item added successfully", item });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("category", "name") // populate category name
      .populate("createdBy", "username email"); // optional
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await Item.find({ category: categoryId });
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    // If frontend sends image URLs, just update
    const updatedItem = await Item.findByIdAndUpdate(itemId, updates, {
      new: true,
    });

    res.json({ message: "Item updated", updatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await Item.findByIdAndDelete(itemId);
    res.json({ message: "Item deleted", deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNutritionInfo = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { calories, protein, fat, carbs, fiber, sugar } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.nutrition = { calories, protein, fat, carbs, fiber, sugar };
    await item.save();

    res.json({ message: "Nutrition info added", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemNutrition = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId, "name nutrition");
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("admintoken", {
      httpOnly: true,
      secure: process.env.ENVI === "production",
      sameSite: process.env.ENVI === "production" ? "none" : "strict",
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
