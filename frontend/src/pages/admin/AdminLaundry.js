import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../../components/PageWrapper";
import Layout from "../../components/Layout";

export default function AdminLaundry() {
  const navigate = useNavigate();
  const [laundryRequests, setLaundryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "pending", "completed"
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Load laundry requests on component mount
  useEffect(() => {
    fetchLaundryRequests();
  }, []);

  const fetchLaundryRequests = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.get(`${API_URL}/admin/laundry/laundries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setLaundryRequests(response.data);
      } else if (response.data && response.data.requests) {
        setLaundryRequests(response.data.requests);
      } else {
        setLaundryRequests([]);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Access denied. Admin privileges required.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError("Failed to load laundry requests. Please try again.");
        console.error("Error fetching laundry requests:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      setLoading(true);
      setError("");
      setStatusMessage("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.patch(
        `${API_URL}/admin/laundry/laundries/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setLaundryRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { 
            ...req, 
            status, 
            completedAt: status === 'completed' ? new Date().toISOString() : req.completedAt 
          } : req
        )
      );
      
      setStatusMessage(`Request #${requestId.slice(-6)} marked as ${status}`);
      setSelectedRequest(null);
      
      fetchLaundryRequests();
      
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update request status");
      console.error("Status update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFilteredRequests = () => {
    return laundryRequests.filter(request => {
      return filterStatus === "all" || request.status === filterStatus;
    });
  };

  const countItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
  };
  
  const getServiceTypeLabel = (type) => {
    switch (type) {
      case "washing": return "Regular Washing";
      case "dry-clean": return "Dry Cleaning";
      case "ironing": return "Ironing Only";
      default: return type;
    }
  };

  return (
    <PageWrapper direction="up">
      <Layout>
        <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-6xl bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl shadow-2xl p-6 mb-8 text-white">
            <h1 className="text-3xl font-bold">Laundry Admin Dashboard</h1>
            <p className="text-blue-200">Manage all laundry service requests</p>
          </div>
          
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
          
          <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Laundry Requests ({laundryRequests.length})
              </h2>
              
              <div className="flex flex-wrap gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                
                <button
                  onClick={fetchLaundryRequests}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
            
            {loading && (
              <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading requests...</p>
              </div>
            )}
            
            {!loading && getFilteredRequests().length === 0 && (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p className="mt-4">No laundry requests match your filters</p>
              </div>
            )}
            
            {!loading && getFilteredRequests().length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {getFilteredRequests().map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{request.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {request.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {getServiceTypeLabel(request.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {countItems(request.items)} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                            {request.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                            View
                          </button>
                          {request.status === 'pending' && (
                            <button
                              onClick={() => updateRequestStatus(request.id, 'completed')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                              Complete
                            </button>
                          )}
                          {request.status === 'completed' && (
                            <button
                              onClick={() => updateRequestStatus(request.id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                              Reopen
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
          
          {selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-90vh overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Request Details #{selectedRequest.id.slice(-6)}
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
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
                      <p className="text-gray-600 dark:text-gray-400">Name: {selectedRequest.user}</p>
                      <p className="text-gray-600 dark:text-gray-400">Email: {selectedRequest.email || "Not available"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Information</h4>
                      <p className="text-gray-600 dark:text-gray-400">Type: {getServiceTypeLabel(selectedRequest.type)}</p>
                      <p className="text-gray-600 dark:text-gray-400">Status: 
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedRequest.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedRequest.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">Submitted: {formatDate(selectedRequest.createdAt)}</p>
                      {selectedRequest.completedAt && (
                        <p className="text-gray-600 dark:text-gray-400">Completed: {formatDate(selectedRequest.completedAt)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Items</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <ul className="space-y-3">
                        {selectedRequest.items.map((item, index) => (
                          <li key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.specialInstructions && (
                              <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                Note: {item.specialInstructions}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap justify-end gap-3">
                    <div className="flex-1 md:flex-none">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Status</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'completed')}
                          disabled={selectedRequest.status === 'completed'}
                          className={`px-3 py-2 text-sm font-medium rounded-lg 
                            ${selectedRequest.status === 'completed' 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'pending')}
                          disabled={selectedRequest.status === 'pending'}
                          className={`px-3 py-2 text-sm font-medium rounded-lg
                            ${selectedRequest.status === 'pending'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-yellow-600 text-white hover:bg-yellow-700'}`}
                        >
                          Mark Pending
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 mt-auto ml-auto">
                      Close
                    </button>
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