import { useState } from "react";
import PageWrapper from "../components/PageWrapper"; // Import transition wrapper
import Layout from "../components/Layout"; // Import Layout component

export default function Salon() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment booked:", formData);
  };

  return (
    <PageWrapper direction="left">
      {" "}
      {/* 🔥 Left swipe transition */}
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          {/* Glassmorphic Booking Container */}
          <div className="w-full max-w-2xl bg-pink-500/20 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-pink-400">
            <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-6 drop-shadow-lg">
              Book Your Salon Service
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-pink-700 text-sm font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-pink-400 outline-none transition-all shadow-md"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-pink-700 text-sm font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-pink-400 outline-none transition-all shadow-md"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-pink-700 text-sm font-semibold">
                  Select a Service
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-pink-400 outline-none transition-all shadow-md"
                >
                  <option value="">Choose a Service</option>
                  <option value="haircut">Haircut & Styling</option>
                  <option value="spa">Spa Treatment</option>
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-pink-700 text-sm font-semibold">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-pink-400 outline-none transition-all shadow-md"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-pink-700 text-sm font-semibold">
                  Preferred Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-pink-400 outline-none transition-all shadow-md"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-400 hover:to-pink-500 text-white py-3 px-6 rounded-full shadow-lg hover:scale-105 hover:ring-4 ring-pink-300 transition-all duration-300"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}
