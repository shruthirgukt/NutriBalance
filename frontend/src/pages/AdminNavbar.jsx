import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { adminUrl, userUrl } from "../api/api";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${adminUrl}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("admin");
      localStorage.removeItem("admintoken");
      toast.success("Logged out successfully!");
      navigate("/"); // redirect to login
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-teal-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate("/adminDashboard")}
          >
            Admin Dashboard
          </h1>

          <div className="space-x-4 flex items-center">
            {/* Categories button */}
            <button
              onClick={() => navigate("/adminCategories")}
              className="bg-white text-teal-700 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Categories
            </button>

            <button
              onClick={handleLogout}
              className="bg-white text-teal-700 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
