import React, { useState, useEffect } from "react";
// Assuming Navbar, Footer, and necessary React Router/Toast components are defined elsewhere
// Since this is a standalone component, we remove the local file imports to prevent errors
// import Navbar from "./Navbar";
// import Footer from "./Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// --- MOCK API DEFINITION & CONFIGURATION ---
// In a real project, this would be an external API file. Using internal mock for self-contained testing.
const API = axios.create({ baseURL: "/api" });

// Mock data to simulate API response from the backend
const MOCK_ITEMS = [
  {
    _id: "prod1",
    name: "Renew Collagen Peptides",
    description:
      "Unflavored, premium bovine collagen to support skin elasticity and joint health. Mixes easily in any drink.",
    price: 39.99,
    category: { name: "Collagen" },
    images: [
      "https://placehold.co/400x300/e0f2f1/047857?text=Collagen+Jar",
      "https://placehold.co/400x300/f0fdfa/065f46?text=Serving+Suggestion",
    ],
    nutrition: {
      calories: 35,
      protein: "9",
      fat: "0",
      carbs: "0",
      fiber: "0",
      sugar: "0",
    },
  },
  {
    _id: "prod2",
    name: "Essential Omega-3 Oil",
    description:
      "High-potency fish oil sourced from deep-sea fish, promoting brain and cardiovascular health with vital EPA/DHA.",
    price: 24.5,
    category: { name: "Essential Fats" },
    images: ["https://placehold.co/400x300/ccfbf1/0d9488?text=Omega+Bottle"],
    nutrition: {
      calories: 10,
      protein: "0",
      fat: "1",
      carbs: "0",
      fiber: "0",
      sugar: "0",
    },
  },
  {
    _id: "prod3",
    name: "Daily Balance Probiotic",
    description:
      "A blend of 10 essential probiotic strains to foster a healthy gut microbiome and improve digestive comfort.",
    price: 31.0,
    category: { name: "Probiotics" },
    images: ["https://placehold.co/400x300/a7f3d0/0f766e?text=Probiotic+Pills"],
    nutrition: {
      calories: 0,
      protein: "0",
      fat: "0",
      carbs: "1",
      fiber: "1",
      sugar: "0",
    },
  },
];

const ProductGallery = () => {
  // NOTE: Replace this with your actual User Context/State hook in a real app
  const user = { username: "HealthFan", role: "User" }; // Mock user data from localStorage
  // const user = JSON.parse(localStorage.getItem("user"));

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0); // track image index in modal

  // State for the main header carousel (showing a rotating image from the first item)
  const [headerCarouselIndex, setHeaderCarouselIndex] = useState(0);
  const featuredItem = items[0]; // Assuming the first item is featured for the header carousel

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // --- START MOCK API CALL ---
        // Replace this with your actual API.get(`${userUrl}/items`);
        await new Promise((r) => setTimeout(r, 800)); // Simulate network latency
        const res = { data: { items: MOCK_ITEMS } };
        // --- END MOCK API CALL ---
        setItems(res.data.items);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();

    // Set up auto-scroll for the main header carousel
    if (featuredItem && featuredItem.images?.length > 1) {
      const interval = setInterval(() => {
        setHeaderCarouselIndex(
          (prev) => (prev + 1) % featuredItem.images.length
        );
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(interval);
    }
  }, [featuredItem?.images?.length]);

  // Next/Prev logic for Modal Carousel
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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar component would go here */}
      <ToastContainer />     {" "}
      <main className="flex-1 bg-gray-50 p-4 sm:p-6">
               {" "}
        <div className="max-w-7xl mx-auto">
                   {" "}
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        Welcome, {user?.username || "Guest"}!          {" "}
          </h2>
          {/* --- TOP-LEVEL FEATURED CAROUSEL --- */}
          {!loading && featuredItem && (
            <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border border-teal-100">
              <div className="relative h-64 md:h-80 w-full">
                <img
                  src={
                    featuredItem.images?.[headerCarouselIndex] ||
                    featuredItem.images?.[0]
                  }
                  alt={featuredItem.name}
                  className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
                  <div>
                    <h3 className="text-3xl font-extrabold text-white drop-shadow-md">
                      Featured: {featuredItem.name}
                    </h3>
                    <p className="text-teal-200 mt-1 max-w-lg">
                      {featuredItem.description.substring(0, 100)}...
                    </p>
                    <button
                      onClick={() => {
                        setSelectedItem(featuredItem);
                        setCarouselIndex(0);
                      }}
                      className="mt-3 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-200 shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* --- END TOP-LEVEL FEATURED CAROUSEL --- */}
          <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2 border-teal-200">
            All Nutritional Supplements
          </h3>
                   {" "}
          {loading ? (
            <div className="text-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-teal-600 mx-auto"
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
              <p className="text-gray-500 mt-2">
                Loading Nutrabalance products...
              </p>
            </div>
          ) : items.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">
              No supplements are currently available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                           {" "}
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border border-gray-100 transform hover:scale-[1.01]"
                  onClick={() => {
                    setSelectedItem(item);
                    setCarouselIndex(0); // reset carousel
                  }}
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    {item.images?.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/400x300/e0f2f1/047857?text=Product+Image";
                        }}
                      />
                    ) : (
                      <div className="h-full bg-teal-50 rounded-t-xl flex items-center justify-center text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-teal-600 uppercase mb-1">
                      {item.category?.name || "Supplement"}
                    </p>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {item.description}
                    </p>
                    <p className="mt-3 font-extrabold text-2xl text-teal-700">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </main>
            {/* Footer component would go here */}     {" "}
      {/* Modal Overlay (Product Detail View) */}     {" "}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
                   {" "}
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
                       {" "}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-teal-600 transition text-2xl"
              onClick={() => setSelectedItem(null)}
            >
                            &times;            {" "}
            </button>
                       {" "}
            <div className="md:flex md:space-x-8">
              {/* Left Side: Image Carousel */}
              <div className="relative mb-6 md:mb-0 md:w-1/2">
                               {" "}
                {selectedItem.images?.length > 0 && (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                       {" "}
                    <img
                      src={selectedItem.images[carouselIndex]}
                      alt={selectedItem.name}
                      className="w-full h-72 object-cover"
                    />
                                       {" "}
                    {selectedItem.images.length > 1 && (
                      <>
                                               {" "}
                        <button
                          onClick={prevImage}
                          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full transition"
                        >
                                                    &#8592;                    
                             {" "}
                        </button>
                                               {" "}
                        <button
                          onClick={nextImage}
                          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full transition"
                        >
                                                    &#8594;                    
                             {" "}
                        </button>
                                             {" "}
                      </>
                    )}
                                     {" "}
                  </div>
                )}
              </div>

              {/* Right Side: Product Details & Nutrition */}
              <div className="md:w-1/2">
                <p className="text-sm font-semibold text-teal-600 uppercase mb-1">
                  {selectedItem.category?.name || "Supplement"}
                </p>
                                 {" "}
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {selectedItem.name}
                </h2>
                                 {" "}
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                                 {" "}
                <p className="font-extrabold text-3xl text-teal-700 mb-4">
                                      ${selectedItem.price.toFixed(2)}         
                         {" "}
                </p>
                                 {" "}
                <h3 className="font-bold text-xl text-gray-800 mb-2 border-b border-gray-200 pb-1">
                  Nutrition Facts
                </h3>
                                 {" "}
                {selectedItem.nutrition ? (
                  <ul className="text-gray-700 space-y-2 text-base bg-teal-50 p-4 rounded-lg">
                                         {" "}
                    <li className="flex justify-between border-b border-teal-200 pb-1">
                      <span>**Calories**</span>{" "}
                      <span>{selectedItem.nutrition.calories}</span>
                    </li>
                                         {" "}
                    <li className="flex justify-between border-b border-teal-200 pb-1">
                      <span>**Protein**</span>{" "}
                      <span>{selectedItem.nutrition.protein}g</span>
                    </li>
                                         {" "}
                    <li className="flex justify-between border-b border-teal-200 pb-1">
                      <span>**Total Fat**</span>{" "}
                      <span>{selectedItem.nutrition.fat}g</span>
                    </li>
                                         {" "}
                    <li className="flex justify-between border-b border-teal-200 pb-1">
                      <span>**Carbohydrates**</span>{" "}
                      <span>{selectedItem.nutrition.carbs}g</span>
                    </li>
                                         {" "}
                    <li className="flex justify-between border-b border-teal-200 pb-1">
                      <span>**Dietary Fiber**</span>{" "}
                      <span>{selectedItem.nutrition.fiber}g</span>
                    </li>
                                         {" "}
                    <li className="flex justify-between">
                      <span>**Sugars**</span>{" "}
                      <span>{selectedItem.nutrition.sugar}g</span>
                    </li>
                                       {" "}
                  </ul>
                ) : (
                  <p className="text-gray-500 bg-gray-100 p-3 rounded-lg">
                    Detailed nutrition info not available for this product.
                  </p>
                )}
                <button className="mt-6 w-full px-4 py-3 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700 transition shadow-lg">
                  Add to Cart
                </button>
              </div>
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default ProductGallery;
