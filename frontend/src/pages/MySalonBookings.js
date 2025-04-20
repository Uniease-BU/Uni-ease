import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Layout from "../components/Layout";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function MySalonBookings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/salon/my-bookings`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(response.data || []);
    } catch (err) {
      setError("Failed to load your salon appointments. Please try again.");
      console.error("Error fetching salon appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(
        `${API_URL}/salon/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local state to reflect the cancelled booking
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking
        )
      );

    } catch (err) {
      setError("Failed to cancel appointment. Please try again.");
      console.error("Error cancelling appointment:", err);
    } finally {
      setCancellingId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': 
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'Confirmed': 
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'Completed': 
        return 'bg-green-100 border-green-400 text-green-800';
      case 'Cancelled': 
        return 'bg-red-100 border-red-400 text-red-800';
      default: 
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  return (
    <PageWrapper direction="right">
      <Layout>
        <div className="flex flex-col items-center min-h-screen px-4 py-8">
          <div className="w-full max-w-5xl bg-gradient-to-r from-pink-500 to-red-400 rounded-xl shadow-2xl p-6 mb-8 text-white">
            <h1 className="text-3xl font-bold">My Salon Appointments</h1>
            <p className="text-pink-100 mt-1">View and manage your appointments</p>
          </div>

          {error && (
            <div className="w-full max-w-5xl bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex">
                <div className="py-1">
                  <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button 
                  onClick={() => setError("")}
                  className="ml-auto pl-3">
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="w-full max-w-5xl p-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your appointments...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center">
              <div className="flex flex-col items-center">
                <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-700">No appointments found</p>
                <p className="mt-2 text-gray-500">You haven't booked any salon appointments yet</p>
                <button
                  onClick={() => navigate("/salon")}
                  className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
                >
                  Book an Appointment
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="ml-2 text-gray-500 text-sm">
                            Booking ID: #{booking.id.slice(-6)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Salon Appointment</h3>
                        <div className="mt-2 flex flex-wrap gap-y-1 gap-x-4">
                          <div className="flex items-center text-gray-600">
                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {formatDate(booking.date)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {booking.time}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex">
                        {['Pending', 'Confirmed'].includes(booking.status) && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                              cancellingId === booking.id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {cancellingId === booking.id ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : null}
                            {cancellingId === booking.id ? "Cancelling..." : "Cancel Appointment"}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Booked on: {formatDate(booking.bookedAt)}
                        </div>
                        <button
                          onClick={() => navigate("/salon")}
                          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                        >
                          Book Another Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </PageWrapper>
  );
}