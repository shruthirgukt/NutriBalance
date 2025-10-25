import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"; // your admin dashboard
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminRoute, UserRoute } from "./pages/PrivateRoute";
import AdminCategories from "./pages/AdminCategories";
import AddItemPage from "./pages/AddItem";
import UserProfile from "./pages/UserProfile";
// import { UserRoute, AdminRoute } from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* User protected route */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          path="/userProfile"
          element={
            <UserRoute>
              <UserProfile />
            </UserRoute>
          }
        />

        {/* Admin protected route */}
        <Route
          path="/adminDashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/adminCategories"
          element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          }
        />

        <Route
          path="/addItem/:id"
          element={
            <AdminRoute>
              <AddItemPage />
            </AdminRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
