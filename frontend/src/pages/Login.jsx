import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { adminUrl, backendUrl, userUrl } from "../api/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("User"); // default role
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleChange = (selectedRole) => setRole(selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        role === "Admin" ? `${adminUrl}/login` : `${userUrl}/login`;

      const res = await axios.post(endpoint, formData);
      toast.success(res.data.message || "Login successful!");

      const user = res.data.user;
      console.log(user);
      const tokenValue = res.data.token; // ✅ Correct token value
      const tokenKey = user.role === "Admin" ? "admintoken" : "usertoken";
      const userKey = user.role === "Admin" ? "admin" : "user";

      // Save data properly
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem(tokenKey, tokenValue);

      if (user.role === "Admin") navigate("/adminDashboard");
      else navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const baseButtonClasses =
    "w-full text-white font-semibold py-3 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center";
  const activeClasses = "bg-teal-600 hover:bg-teal-700";
  const disabledClasses = "bg-gray-400 cursor-not-allowed";
  const buttonClassName = isLoading
    ? `${baseButtonClasses} ${disabledClasses}`
    : `${baseButtonClasses} ${activeClasses}`;

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white p-8 md:p-12 shadow-2xl rounded-xl">
          {/* Role Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => handleRoleChange("User")}
              className={`px-6 py-2 rounded-l-lg border border-gray-300 ${
                role === "User"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              User
            </button>
            <button
              onClick={() => handleRoleChange("Admin")}
              className={`px-6 py-2 rounded-r-lg border border-gray-300 ${
                role === "Admin"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Welcome Back! 🌿
            </h1>
            <p className="text-gray-500 mt-2">
              Access your Nutrabalance {role.toLowerCase()} account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={buttonClassName}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-teal-600 hover:text-teal-800 font-medium cursor-pointer ml-1 transition duration-150"
              >
                Register now
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
