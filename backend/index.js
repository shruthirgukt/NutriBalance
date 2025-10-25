import express from "express";
const app = express();
import cookieParser from "cookie-parser";
app.use(cookieParser());
app.use(express.json());
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://nutri-balance-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies
  })
);

import connectDB from "./config/mongoDB.js";
connectDB();

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running successfully at ${PORT}`);
});

