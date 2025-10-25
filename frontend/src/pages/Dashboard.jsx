import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { userUrl } from "../api/api";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${userUrl}/items`);
        setItems(res.data.items);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const nextImage = () => {
    setCarouselIndex(
      (prev) => (prev + 1) % (selectedItem?.images?.length || 1)
    );
  };

  const prevImage = () => {
    setCarouselIndex(
      (prev) =>
        (prev - 1 + (selectedItem?.images?.length || 1)) %
        (selectedItem?.images?.length || 1)
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Welcome back, {user?.username || "User"}! 👋
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover premium supplements tailored for your wellness journey
            </p>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      {items.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <div className="lg:flex">
              <div className="lg:w-1/2 relative">
                <img
                  src={items[0].images?.[0] || "/api/placeholder/600/400"}
                  alt={items[0].name}
                  className="w-full h-64 lg:h-80 object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center mb-3">
                  <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {items[0].category?.name || "Supplement"}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {items[0].name}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {items[0].description}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-emerald-600">
                    ${items[0].price.toFixed(2)}
                  </span>
                </div>

                {items[0].nutrition && (
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-100">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        NutriBalance Profile
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                        <div className="font-bold text-emerald-600">
                          {items[0].nutrition.calories}
                        </div>
                        <div className="text-gray-500 text-xs">Calories</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                        <div className="font-bold text-emerald-600">
                          {items[0].nutrition.protein}g
                        </div>
                        <div className="text-gray-500 text-xs">Protein</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                        <div className="font-bold text-emerald-600">
                          {items[0].nutrition.fat}g
                        </div>
                        <div className="text-gray-500 text-xs">Fat</div>
                      </div>
                    </div>
                  </div>
                )}

                <button className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Shop Featured Product
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
            <p className="text-gray-600 mt-2">
              Carefully curated for your health and wellness
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {items.length} {items.length === 1 ? "product" : "products"}{" "}
            available
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products available
            </h3>
            <p className="text-gray-500">Check back later for new arrivals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden"
                onClick={() => {
                  setSelectedItem(item);
                  setCarouselIndex(0);
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  {item.images?.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
                      <span className="text-4xl">🌿</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {item.category?.name || "Supplement"}
                    </span>
                    {index < 3 && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-600">
                      ${item.price.toFixed(2)}
                    </span>
                    <button className="text-gray-400 hover:text-emerald-500 transition-colors p-2 rounded-full hover:bg-emerald-50">
                      <svg
                        className="w-5 h-5"
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
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Enhanced Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                Product Details
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                onClick={() => setSelectedItem(null)}
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

            <div className="md:flex">
              {/* Left: Images */}
              <div className="md:w-1/2 p-6 bg-gray-50">
                <div className="relative">
                  {selectedItem.images?.length > 0 && (
                    <img
                      src={selectedItem.images[carouselIndex]}
                      alt={selectedItem.name}
                      className="w-full h-80 object-cover rounded-xl shadow-sm"
                    />
                  )}

                  {selectedItem.images?.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      {/* Image indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {selectedItem.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCarouselIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === carouselIndex
                                ? "bg-white scale-125"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {selectedItem.images?.length > 1 && (
                  <div className="flex space-x-2 mt-4 overflow-x-auto">
                    {selectedItem.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCarouselIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                          index === carouselIndex
                            ? "border-emerald-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="md:w-1/2 p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
                    {selectedItem.category?.name || "Supplement"}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {selectedItem.name}
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-emerald-600">
                    ${selectedItem.price.toFixed(2)}
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-emerald-500"
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
                    Nutrition Facts
                  </h3>

                  {selectedItem.nutrition ? (
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-emerald-600">
                            {selectedItem.nutrition.calories}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Calories
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-emerald-600">
                            {selectedItem.nutrition.protein}g
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Protein
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-emerald-600">
                            {selectedItem.nutrition.fat}g
                          </div>
                          <div className="text-sm text-gray-500 mt-1">Fat</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-emerald-600">
                            {selectedItem.nutrition.carbs}g
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Carbs
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-emerald-600">
                            {selectedItem.nutrition.fiber}g
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Fiber
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-emerald-600">
                            {selectedItem.nutrition.sugar}g
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Sugar
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <span className="text-4xl mb-3 block">📊</span>
                      <p className="text-gray-500">
                        Nutrition information not available
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Add to Cart
                  </button>
                  <button className="px-4 border border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
