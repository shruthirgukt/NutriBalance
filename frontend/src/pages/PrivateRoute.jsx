// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Protected route for logged-in users
export const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("usertoken"); // ✅ correct key

  if (!user || !token || user.role.toLowerCase() !== "user") {
    return <Navigate to="/" />; // redirect to login
  }

  return children;
};

// Protected route for admins
export const AdminRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = localStorage.getItem("admintoken"); // ✅ correct key

  if (!admin || !token || admin.role.toLowerCase() !== "admin") {
    return <Navigate to="/" />; // redirect to login
  }

  return children;
};
