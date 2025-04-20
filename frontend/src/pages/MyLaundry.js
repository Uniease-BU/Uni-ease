import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import Layout from "../components/Layout";

export default function MyLaundry() {
  const navigate = useNavigate();
  const [laundryRequests, setLaundryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Fetch user's laundry requests on component mount
  useEffect(() => {
    fetchMyLaundry();
  }, []);

  const fetchMyLaundry = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("You need to login to view your laundry requests");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      const response = await axios.get(`${API_URL}/laundry/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLaundryRequests(response.data);
    } catch (err) {
      console.error("Error fetching laundry requests:", err);
      setError("Failed to load your laundry requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Get service type label
  const getServiceTypeLabel = (type) => {
    switch (type) {
      case "washing":
        return "Regular Washing";
      case "dry-clean":
        return "Dry Cleaning";
      case "ironing":
        return "Ironing Only";
      default:
        return type;
    }
  };

  return (
    <PageWrapper direction="left">
      <Layout>
        <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 py-12">
          {/* Header Section */}
          <div className="w-full max-w-4xl bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">My Laundry Requests</h1>
                <p className="text-blue-200 mt-1">Manage and track your laundry service requests</p>
              </div>
              <Link 
                to="/laundry"
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                New Request
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-4xl mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-700 hover:text-red-900"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your laundry requests...</p>
            </div>
          )}

          {/* No Requests State */}
          {!loading && laundryRequests.length === 0 && (
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No laundry requests yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't submitted any laundry service requests yet. Create a new request to get started.</p>
              <Link
                to="/laundry"
                className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Create New Request
              </Link>
            </div>
          )}

          {/* Requests List */}
          {!loading && laundryRequests.length > 0 && (
            <div className="w-full max-w-4xl">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                {laundryRequests.map((request) => (
                  <div key={request._id} className="p-4 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {getServiceTypeLabel(request.type)}
                          </span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Submitted on {formatDate(request.createdAt)}
                        </p>
                        {request.completedAt && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Completed on {formatDate(request.completedAt)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowDetails(showDetails === request._id ? null : request._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {showDetails === request._id ? "Hide Details" : "View Details"}
                      </button>
                    </div>

                    {/* Item Summary (always visible) */}
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Items: {request.items.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0)} total
                      </p>
                    </div>

                    {/* Details Section */}
                    {showDetails === request._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Item Details:
                        </h4>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                          {request.items.map((item, idx) => (
                            <li key={idx} className="py-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-800 dark:text-gray-200">
                                  {item.quantity}x {item.name}
                                </span>
                              </div>
                              {item.specialInstructions && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </PageWrapper>
  );
}