import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { adminUrl } from "../api/api";
import { useNavigate } from "react-router-dom";

const AdminCategories = () => {
  const token = localStorage.getItem("admintoken");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${adminUrl}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${adminUrl}/category`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await axios.delete(`${adminUrl}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    setActionLoading(true);
    try {
      await axios.put(
        `${adminUrl}/category/${editingCategory._id}`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category updated successfully");
      setEditingCategory(null);
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddItemRedirect = (catId, catName) => {
    navigate(`/addItem/${catId}`, { state: { categoryName: catName } });
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-9 bg-gray-200 rounded w-20"></div>
              <div className="h-9 bg-gray-200 rounded w-16"></div>
              <div className="h-9 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <AdminNavbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Category Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Organize your products with categories. Create, edit, and manage
              product categories efficiently.
            </p>
          </div>

          {/* Add Category Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Category
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !editingCategory && handleAddCategory()
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={actionLoading}
                />
              </div>
              {!editingCategory ? (
                <button
                  onClick={handleAddCategory}
                  disabled={actionLoading || !newCategory.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center min-w-[120px]"
                >
                  {actionLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Category
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                All Categories ({categories.length})
              </h2>
            </div>

            <div className="p-6">
              {loading ? (
                <LoadingSkeleton />
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No categories found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by creating your first category
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {categories.map((cat, index) => (
                    <div
                      key={cat._id}
                      className="bg-gray-50 hover:bg-indigo-50 rounded-xl p-6 border border-gray-200 hover:border-indigo-200 transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4">
                            {cat.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                              {cat.name}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
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
                              Created recently
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              handleAddItemRedirect(cat._id, cat.name)
                            }
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Add Item
                          </button>
                          <button
                            onClick={() => handleEditCategory(cat)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 text-sm flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategory(cat._id, cat.name)
                            }
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-amber-500"
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
                Edit Category
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategory("");
                }}
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

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleUpdateCategory()
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  placeholder="Enter category name..."
                  autoFocus
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategory("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  disabled={actionLoading || !newCategory.trim()}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center"
                >
                  {actionLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
