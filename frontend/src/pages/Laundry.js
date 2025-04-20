import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import Layout from "../components/Layout";

export default function LaundryBooking() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  
  const [formData, setFormData] = useState({
    type: "washing", // Default service type
    items: [{ id: 1, name: "", quantity: 1, specialInstructions: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        type: "error",
        text: "Please login to use the laundry service",
      });
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle item changes
  const handleItemChange = (index, e) => {
    const newItems = [...formData.items];
    newItems[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items: newItems });
  };

  // Add a new item
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: Date.now(), name: "", quantity: 1, specialInstructions: "" }],
    });
  };

  // Remove an item
  const removeItem = (id) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== id),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setMessage({
        type: "error",
        text: "Please login to submit a laundry request",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }
    
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    // Clean up the items data to match backend expectations
    const cleanedItems = formData.items.map(item => ({
      name: item.name,
      quantity: Number(item.quantity),
      specialInstructions: item.specialInstructions || ""
    }));
    
    try {
      const token = localStorage.getItem("token");
      // Send to the specific endpoint based on service type
      const response = await axios.post(
        `${API_URL}/laundry/${formData.type}`,
        {
          items: cleanedItems
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessage({
        type: "success",
        text: "Laundry request submitted successfully! Your request is being processed."
      });
      
      // Reset form
      setFormData({
        type: "washing",
        items: [{ id: 1, name: "", quantity: 1, specialInstructions: "" }],
      });
      
      // After 2 seconds, redirect to My Laundry page
      setTimeout(() => {
        navigate("/my-laundry");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting laundry request:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to submit your request. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper direction="right">
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          {/* Message Display */}
          {message.text && (
            <div className={`w-full max-w-2xl mb-6 p-4 rounded-xl ${
              message.type === "error" 
                ? "bg-red-100 border-red-400 text-red-700" 
                : "bg-green-100 border-green-400 text-green-700"
            }`}>
              <p className="font-medium">{message.text}</p>
            </div>
          )}
        
          {/* Floating Glassmorphic Container */}
          <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-600">
            <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-6 drop-shadow-lg">
              Laundry Service Booking
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type Selection */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold">
                  Service Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="washing">Regular Washing</option>
                  <option value="dry-clean">Dry Cleaning</option>
                  <option value="ironing">Ironing Only</option>
                </select>
              </div>

              {/* Items Section */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold">
                  Items
                </label>
                {formData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 mt-2 bg-gray-700 p-3 rounded-xl"
                  >
                    <div className="w-2/3">
                      <input
                        type="text"
                        name="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Item Name"
                        required
                        className="w-full p-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                      />
                      {index === 0 && (
                        <p className="text-xs text-gray-400 mt-1 ml-1">
                          e.g. Jeans, T-shirt, Dress, etc.
                        </p>
                      )}
                    </div>
                    <div className="w-1/3">
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleItemChange(index, e)}
                        required
                        className="w-full p-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                      />
                      {index === 0 && (
                        <p className="text-xs text-gray-400 mt-1 ml-1">
                          Quantity
                        </p>
                      )}
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-500 text-xl transition-all"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-full shadow-md hover:scale-105 transition-all duration-300"
                >
                  + Add Another Item
                </button>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.items[0].specialInstructions}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[0].specialInstructions = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  rows="3"
                  placeholder="Any special instructions for handling your items..."
                  className="w-full p-3 mt-1 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white py-3 px-6 rounded-full shadow-lg ${!loading ? 'hover:scale-105 hover:ring-4 ring-indigo-300' : 'opacity-70'} transition-all duration-300`}
              >
                {loading ? "Processing..." : "Submit Booking"}
              </button>
              
              {/* My Laundry View Button */}
              {isAuthenticated && (
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/my-laundry")}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View My Laundry Requests
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}
