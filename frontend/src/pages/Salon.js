import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Layout from "../components/Layout";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Salon() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    time: "",
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Calculate the minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // Calculate the maximum date (7 days from now)
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const fetchAvailableSlots = async (date) => {
    if (!date) return;
    
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.get(
        `${API_URL}/salon/available-slots?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAvailableSlots(response.data.availableSlots || []);
      
      if (response.data.availableSlots?.length === 0) {
        setMessage({ 
          type: "info", 
          text: "No available slots for this date. Please try another day." 
        });
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setMessage({ 
        type: "error", 
        text: "Failed to fetch available slots. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFormData(prevData => ({ ...prevData, time: "" }));
    fetchAvailableSlots(date);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.time) {
      setMessage({ type: "error", text: "Please select both date and time" });
      return;
    }
    
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/salon/bookings`,
        {
          date: selectedDate,
          time: formData.time
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage({
        type: "success",
        text: "Your salon appointment has been booked successfully! You can view it in My Appointments."
      });
      
      // Reset form
      setFormData({ time: "" });
      setSelectedDate("");
      setAvailableSlots([]);
      
      // Redirect to bookings page after short delay
      setTimeout(() => {
        navigate("/my-salon-bookings");
      }, 3000);
      
    } catch (error) {
      console.error("Error booking appointment:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to book appointment. Please try again."
      });
    } finally {
      setLoading(false);
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
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          {/* Header */}
          <div className="w-full max-w-2xl bg-gradient-to-r from-pink-500 to-red-400 rounded-xl shadow-2xl p-6 mb-8 text-white text-center">
            <h1 className="text-3xl font-bold">Salon Services</h1>
            <p className="mt-2 text-pink-100">Book your appointment today</p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`w-full max-w-2xl p-4 mb-6 rounded ${getMessageStyles()}`}>
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

          {/* Booking Container */}
          <div className="w-full max-w-2xl bg-pink-500/20 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-pink-400">
            <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6 drop-shadow-lg">
              Book Your Appointment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-pink-700 text-sm font-semibold">
                  Select a Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={minDate}
                  max={maxDateStr}
                  required
                  className="w-full p-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-pink-400 outline-none transition-all shadow-md"
                />
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-pink-700 text-sm font-semibold">
                    Select Available Time Slot
                  </label>
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, time: slot })}
                          className={`p-2 rounded-lg transition-all ${
                            formData.time === slot
                              ? "bg-pink-600 text-white shadow-lg"
                              : "bg-white text-pink-700 hover:bg-pink-100"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : !loading && selectedDate && (
                    <p className="text-pink-700 italic mt-2">
                      No available slots for this date. Please try another day.
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedDate || !formData.time}
                className={`w-full py-3 px-6 rounded-full shadow-lg transition-all duration-300 ${
                  loading || !selectedDate || !formData.time
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-400 hover:to-pink-500 text-white hover:scale-105 hover:ring-4 ring-pink-300"
                }`}
              >
                {loading ? "Processing..." : "Book Now"}
              </button>
            </form>
          </div>
          
          {/* Link to see existing bookings */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/my-salon-bookings")}
              className="text-pink-600 hover:text-pink-800 underline transition"
            >
              View My Salon Appointments
            </button>
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}
