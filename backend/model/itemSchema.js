import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  nutrition: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
    fiber: Number,
    sugar: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Item", itemSchema);
