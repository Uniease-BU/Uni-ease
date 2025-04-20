import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../../components/PageWrapper";
import Layout from "../../components/Layout";

export default function AdminSalon() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [stats, setStats] = useState({
    byStatus: { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 },
    today: 0
  });
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.get(`${API_URL}/admin/salon/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Non-critical, so don't show error to user
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const queryParams = new URLSearchParams();
      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }
      if (filterDate) {
        queryParams.append("date", filterDate);
      }
      
      const url = `${API_URL}/admin/salon/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(response.data || []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Access denied. Admin privileges required.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError("Failed to load salon bookings. Please try again.");
        console.error("Error fetching salon bookings:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setLoading(true);
      setError("");
      setStatusMessage("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      await axios.patch(
        `${API_URL}/admin/salon/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the booking in the state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
      
      // Update stats after status change
      fetchStats();
      
      setStatusMessage(`Booking #${bookingId.slice(-6)} status changed to ${status}`);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update booking status");
      console.error("Status update error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format short date for filter
  const formatFilterDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get filtered bookings
  const getFilteredBookings = () => {
    return bookings;
  };
  
  // Reset filter
  const resetFilter = () => {
    setFilterStatus("all");
    setFilterDate("");
    fetchBookings();
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <PageWrapper direction="up">
      <Layout>
        <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-6xl bg-gradient-to-r from-green-600 to-teal-700 rounded-xl shadow-2xl p-6 mb-8 text-white">
            <h1 className="text-3xl font-bold">Salon Admin Dashboard</h1>
            <p className="text-green-200">Manage all salon appointments</p>
          </div>
          
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-6xl mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.byStatus?.Pending || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-500">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Confirmed</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.byStatus?.Confirmed || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-500">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.byStatus?.Completed || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-red-500">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Cancelled</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.byStatus?.Cancelled || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-purple-500">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Today's Appointments</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.today || 0}
              </p>
            </div>
          </div>
          
          {/* Status Messages */}
          {statusMessage && (
            <div className="w-full max-w-6xl bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              <div className="flex">
                <div className="py-1">
                  <svg className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Success</p>
                  <p className="text-sm">{statusMessage}</p>
                </div>
                <button 
                  onClick={() => setStatusMessage("")}
                  className="ml-auto pl-3">
                  &times;
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="w-full max-w-6xl bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
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
          
          {/* Main Content Area */}
          <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Filters and Controls */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Salon Appointments ({bookings.length})
                </h2>
                
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg focus:outline-none"
                  />
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchBookings()}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Apply Filter
                    </button>
                    
                    <button
                      onClick={resetFilter}
                      className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading appointments...</p>
              </div>
            )}
            
            {/* No Bookings */}
            {!loading && getFilteredBookings().length === 0 && (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="mt-4">No appointments found</p>
              </div>
            )}
            
            {/* Bookings List */}
            {!loading && getFilteredBookings().length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {getFilteredBookings().map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{booking.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {booking.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatDate(booking.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {booking.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                            View
                          </button>
                          
                          {booking.status === 'Pending' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                              Confirm
                            </button>
                          )}
                          
                          {['Pending', 'Confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'Completed')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4">
                              Complete
                            </button>
                          )}
                          
                          {['Pending', 'Confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Booking Details Modal */}
          {selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Booking Details #{selectedBooking.id.slice(-6)}
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Customer Information</h4>
                      <p className="text-gray-600 dark:text-gray-400">Name: {selectedBooking.user}</p>
                      <p className="text-gray-600 dark:text-gray-400">Email: {selectedBooking.email || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Booking Information</h4>
                      <p className="text-gray-600 dark:text-gray-400">Date: {formatDate(selectedBooking.date)}</p>
                      <p className="text-gray-600 dark:text-gray-400">Time: {selectedBooking.time}</p>
                      <p className="text-gray-600 dark:text-gray-400">Status: <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</span></p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Booked on: {formatDate(selectedBooking.bookedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      Close
                    </button>
                    
                    {selectedBooking.status === 'Pending' && (
                      <button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'Confirmed')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Confirm Appointment
                      </button>
                    )}
                    
                    {['Pending', 'Confirmed'].includes(selectedBooking.status) && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'Completed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'Cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          Cancel Appointment
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </PageWrapper>
  );
}