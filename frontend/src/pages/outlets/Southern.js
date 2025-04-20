import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash, FiPlus, FiMinus, FiX } from "react-icons/fi";
import Layout from "../../components/Layout";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import PageWrapper from "../../components/PageWrapper";

// Menu categories
const categories = [
  "Snacks",
  "Desserts",
  "Drinks",
  "Main Course",
  "Sides",
  "Breakfast",
  "Combos",
  "Specials",
];

export default function SouthernStories() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Snacks");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [outletId, setOutletId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchOutletAndMenu();
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (outletId) {
      fetchCart();
    }
  }, [outletId]);

  const fetchOutletAndMenu = async () => {
    try {
      setLoading(true);
      
      // First, get all outlets to find Southern Stories ID
      const outletResponse = await axios.get(`${API_URL}/food/outlets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      const southernOutlet = outletResponse.data.find(outlet => outlet.name === "Southern Stories");
      
      if (!southernOutlet) {
        setError("Southern Stories outlet not found");
        setLoading(false);
        return;
      }
      
      setOutletId(southernOutlet._id);
      
      // Then fetch the menu for this outlet
      const menuResponse = await axios.get(`${API_URL}/food/outlets/${southernOutlet._id}/menu`);
      
      // Group menu items by category
      const groupedMenu = {};
      
      menuResponse.data.menu.forEach(item => {
        // Assign to a default category if no specific category
        const category = item.category || "Snacks";
        
        if (!groupedMenu[category]) {
          groupedMenu[category] = [];
        }
        
        groupedMenu[category].push({
          id: item._id,
          name: item.name,
          price: item.price,
          description: `${item.dietary_tags?.join(", ") || ""} dish`,
          image: "/images/food.jpg" // Default image
        });
      });
      
      // If we don't have items for all categories, set up empty arrays
      categories.forEach(category => {
        if (!groupedMenu[category]) {
          groupedMenu[category] = [];
        }
      });
      
      setMenuItems(groupedMenu);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      setError("Failed to load menu. Please try again later.");
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/food/outlets/${outletId}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Transform the cart data from API to our local cart format
      if (response.data.items && response.data.items.length > 0) {
        const transformedCart = response.data.items.map(item => ({
          id: item.item_id,
          name: item.item,
          price: item.price,
          quantity: item.quantity
        }));
        
        setCart(transformedCart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Don't show error for cart fetch - just set empty cart
      setCart([]);
    }
  };

  const addToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      await axios.post(
        `${API_URL}/food/outlets/${outletId}/cart`,
        {
          item_id: item.id,
          quantity: 1
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local cart state
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id);
        if (existingItem) {
          return prevCart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return [...prevCart, { ...item, quantity: 1 }];
        }
      });
      
      setMessage({ type: "success", text: `${item.name} added to cart` });
      
      // Auto-dismiss message after 2 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage({ type: "error", text: "Failed to add item to cart" });
    }
  };

  const removeFromCart = async (itemId) => {
    // For simplicity, we're just removing the item from the local state
    // In a complete implementation, we would also update the backend
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const getTotalCost = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      if (cart.length === 0) {
        setMessage({ type: "error", text: "Your cart is empty" });
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/food/outlets/${outletId}/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrderPlaced(true);
      setCart([]);
      setMessage({ 
        type: "success", 
        text: `Order placed successfully! Order #${response.data.order_id}` 
      });
      
      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate("/my-orders");
      }, 3000);
      
    } catch (error) {
      console.error("Checkout error:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.error || "Failed to place order"
      });
    }
  };

  // Message styling
  const getMessageStyles = () => {
    switch (message.type) {
      case "success":
        return "bg-green-100 border-l-4 border-green-500 text-green-700";
      case "error":
        return "bg-red-100 border-l-4 border-red-500 text-red-700";
      case "info":
        return "bg-blue-100 border-l-4 border-blue-500 text-blue-700";
      default:
        return "";
    }
  };

  return (
    <PageWrapper direction="left">
      <Layout>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-yellow-500">Loading menu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button 
                onClick={fetchOutletAndMenu}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center min-h-screen px-6 md:px-16 py-12 space-y-8 md:space-y-16">
            {/* Header */}
            <div
              className="w-full h-64 md:h-80 bg-cover bg-center flex items-center justify-center text-white text-3xl md:text-5xl font-extrabold rounded-xl overflow-hidden"
              style={{ backgroundImage: "url('/images/stories.jpg')" }}
            >
              <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
                Southern Stories
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`w-full max-w-6xl p-4 rounded ${getMessageStyles()}`}>
                <div className="flex">
                  <div className="py-1">
                    {message.type === "success" && (
                      <svg className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                    {message.type === "error" && (
                      <svg className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-bold">{message.type === "success" ? "Success!" : message.type === "error" ? "Error!" : "Info"}</p>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <button 
                    onClick={() => setMessage({ type: "", text: "" })}
                    className="ml-auto pl-3">
                    &times;
                  </button>
                </div>
              </div>
            )}

            {/* Category Selector */}
            <div className="w-full overflow-x-auto">
              <div className="flex justify-start space-x-8 text-white text-lg font-semibold border-b border-gray-700 pb-4 min-w-max">
                {categories.map((category) => (
                  <span
                    key={category}
                    className={`cursor-pointer transition-all px-2 py-1 ${
                      selectedCategory === category
                        ? "text-yellow-400 text-xl border-b-2 border-yellow-400"
                        : "hover:text-yellow-300"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
              {menuItems[selectedCategory] && menuItems[selectedCategory].length > 0 ? (
                menuItems[selectedCategory].map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-4 flex flex-col justify-between flex-grow">
                      <h3 className="text-2xl text-white font-bold">{item.name}</h3>
                      <p className="text-gray-400 text-md mt-1">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-yellow-400 text-lg font-semibold">
                          ₹{item.price}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-green-500 text-white p-3 rounded-full hover:bg-green-400 transition-all"
                        >
                          <FiShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  No items available in this category
                </div>
              )}
            </div>

            {/* Cart Sidebar */}
            {isCartOpen && (
              <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-gray-900 p-6 shadow-lg flex flex-col z-50">
                <div className="flex justify-between text-white text-xl">
                  <h2>Your Cart</h2>
                  <FiX
                    className="cursor-pointer"
                    onClick={() => setIsCartOpen(false)}
                  />
                </div>
                
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-grow">
                    <FiShoppingCart size={64} className="text-gray-600 mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-grow overflow-y-auto mt-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-white my-4 p-2 border-b border-gray-800"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-400">₹{item.price} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FiTrash size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto border-t border-gray-800 pt-4">
                      <div className="flex justify-between text-white text-lg font-semibold mb-4">
                        <span>Total:</span>
                        <span>₹{getTotalCost()}</span>
                      </div>
                      
                      <button
                        onClick={checkout}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium"
                      >
                        Checkout
                      </button>
                      
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-full mt-2 border border-gray-600 text-gray-300 py-2 rounded-lg"
                      >
                        Continue Ordering
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Cart Float Button */}
        {!loading && !error && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 bg-yellow-500 p-4 rounded-full text-white shadow-lg hover:bg-yellow-600 transition-all flex items-center"
          >
            <FiShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="ml-2 font-bold">{cart.length}</span>
            )}
          </button>
        )}
      </Layout>
    </PageWrapper>
  );
}
