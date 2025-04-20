import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";

export default function MyOrders() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.get(`${API_URL}/food/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders. Please try again later.");
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get order status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          label: "Payment Pending"
        };
      case "preparing":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          label: "Preparing"
        };
      case "ready":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          label: "Ready for Pickup"
        };
      case "completed":
      case "picked_up":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          label: "Completed"
        };
      case "cancelled":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          label: "Cancelled"
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          label: status
        };
    }
  };

  return (
    <PageWrapper direction="down">
      <Layout>
        <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-5xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-200">My Food Orders</h1>
              <button
                onClick={() => navigate("/food-outlets")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Order More Food
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-xl font-medium text-gray-300 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't placed any food orders yet.</p>
                <Link 
                  to="/food-outlets" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Explore Food Outlets
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div 
                    key={order._id} 
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700"
                  >
                    <div className="p-5 border-b border-gray-700 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl text-white font-semibold">
                          {order.outlet?.name || "Unknown Outlet"}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Order #{order._id.substring(0, 8)}... • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(order.status).bgColor} ${getStatusBadge(order.status).textColor}`}>
                        {getStatusBadge(order.status).label}
                      </div>
                    </div>
                    
                    <div className="p-5 border-b border-gray-700">
                      <h4 className="text-md text-gray-300 font-semibold mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              {item.quantity}x {item.item?.name || "Unknown item"}
                            </span>
                            <span className="text-gray-400">₹{item.item?.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-5 flex justify-between items-center">
                      <div className="text-gray-400">
                        <span className="text-gray-300 font-semibold text-lg">Total: </span>
                        <span className="text-yellow-400 font-bold text-lg">₹{order.total}</span>
                      </div>
                      
                      {order.status === "ready" && (
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              await axios.post(
                                `${API_URL}/food/orders/${order._id}/confirm`,
                                {},
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              fetchOrders();
                            } catch (error) {
                              console.error("Error confirming pickup:", error);
                              setError("Failed to confirm pickup. Please try again.");
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Confirm Pickup
                        </button>
                      )}
                      
                      {order.status === "pending" && (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}