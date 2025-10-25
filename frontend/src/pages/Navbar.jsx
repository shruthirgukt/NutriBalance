import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // make sure axios is imported
import { toast } from "react-toastify"; // <- import toast
import { userUrl } from "../api/api"; // your backend URL for user routes

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear cookie
      await axios.post(`${userUrl}/logout`, {}, { withCredentials: true });

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("usertoken");

      toast.success("Logged out successfully!");
      navigate("/"); // redirect to homepage or login
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Nutrabalance
            </h1>
            <ul className="flex space-x-4">
              <li
                className="hover:bg-teal-500 px-3 py-2 rounded cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Home
              </li>
              <li
                className="hover:bg-teal-500 px-3 py-2 rounded cursor-pointer"
                onClick={() => navigate("/userProfile")}
              >
                Profile
              </li>
              {/* <li
                className="hover:bg-teal-500 px-3 py-2 rounded cursor-pointer"
                onClick={() => navigate("/settings")}
              >
                Settings
              </li> */}
            </ul>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="bg-white text-teal-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
