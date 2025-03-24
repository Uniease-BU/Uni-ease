import { useState } from "react";
import PageWrapper from "../components/PageWrapper"; // Import transition wrapper
import Layout from "../components/Layout"; // Import Layout component

export default function LaundryBooking() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    date: "",
    additionalDetails: "",
    items: [{ id: 1, name: "", quantity: 1 }], // Default item
  });

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
      items: [...formData.items, { id: Date.now(), name: "", quantity: 1 }],
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Laundry Booking Submitted:", formData);
  };

  return (
    <PageWrapper direction="right">
      {" "}
      {/* 🔥 Wrap page with swipe transition */}
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          {/* Floating Glassmorphic Container */}
          <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-600">
            <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-6 drop-shadow-lg">
              Laundry Service Booking
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold">
                  Date of Service
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
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
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Item Name"
                      required
                      className="w-2/3 p-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleItemChange(index, e)}
                      required
                      className="w-1/3 p-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-500 text-xl transition-all"
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

              {/* Additional Details */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold">
                  Additional Details
                </label>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 mt-1 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:scale-105 hover:ring-4 ring-indigo-300 transition-all duration-300"
              >
                Submit Booking
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}
