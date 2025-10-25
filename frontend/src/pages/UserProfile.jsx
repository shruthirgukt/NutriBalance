import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { userUrl } from "../api/api";
import Navbar from "./Navbar";
import Footer from "./Footer";

const UserProfile = () => {
  const token = localStorage.getItem("usertoken");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateData, setUpdateData] = useState({ username: "", email: "" });
  const [updating, setUpdating] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${userUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setUpdateData({
          username: res.data.user.username,
          email: res.data.user.email,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`${userUrl}/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.updatedUser);
      setShowUpdate(false);
      toast.success(res.data.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-40 mt-6"></div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
        <Navbar />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Your Profile
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <p className="text-teal-100 opacity-90">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-teal-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Username
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {user?.username}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Email Address
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {user?.email}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Account Role
                        </p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">
                          {user?.role}
                        </p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user?.role === "admin"
                            ? "bg-purple-400"
                            : "bg-teal-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-teal-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Account Status
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-teal-600 font-semibold">
                            Account Verified
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            Active
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-teal-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-semibold">
                            Member Since
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            Recently
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={() => setShowUpdate(true)}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>

                <button className="flex-1 border border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Update Profile Modal */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Update Profile
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowUpdate(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={updateData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      placeholder="Enter your username"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={updateData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdate(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {updating ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
