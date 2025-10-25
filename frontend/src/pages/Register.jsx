import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl, userUrl } from "../api/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${userUrl}/register`, formData);
      toast.success(res.data.message || "Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please check your details."
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Join Nutrabalance ✨
            </h1>
            <p className="text-gray-500 mt-2">
              Create your account for balanced health.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                required
              />
            </div>
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
                placeholder="you@example.com"
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
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                required
              />
            </div>
            <button
              type="submit"
              className={buttonClassName}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?
              <span
                onClick={() => navigate("/")}
                className="text-teal-600 hover:text-teal-800 font-medium cursor-pointer ml-1 transition duration-150"
              >
                Login here
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
