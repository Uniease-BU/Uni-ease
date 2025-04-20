import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Layout from "../../components/Layout";
import PageWrapper from "../../components/PageWrapper";

export default function AdminFood() {
  const navigate = useNavigate();
  const { isAuthenticated, userData, adminType } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [outlet, setOutlet] = useState(null);
  const [activeStatus, setActiveStatus] = useState("all");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!userData || userData.role !== "admin") {
      navigate("/");
      return;
    }

    if (adminType) {
      // For Southern Stories and Snap Eats admins, set outlet info directly
      if (adminType === 'southern') {
        setOutlet({
          name: "Southern Stories",
          _id: localStorage.getItem("southernOutletId") || ""
        });
        fetchOutletId("Southern Stories");
      } else if (adminType === 'snap') {
        setOutlet({
          name: "Snap Eats",
          _id: localStorage.getItem("snapOutletId") || ""
        });
        fetchOutletId("Snap Eats");
      } else {
        fetchOutletDetails();
      }
    } else {
      fetchOutletDetails();
    }
  }, [isAuthenticated, userData, adminType, navigate]);
  
  // Fetch outlet ID based on name
  const fetchOutletId = async (outletName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/food/outlets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const foundOutlet = response.data.find(outlet => outlet.name === outletName);
      
      if (foundOutlet && foundOutlet._id) {
        if (outletName === "Southern Stories") {
          localStorage.setItem("southernOutletId", foundOutlet._id);
          setOutlet(prev => ({ ...prev, _id: foundOutlet._id }));
        } else if (outletName === "Snap Eats") {
          localStorage.setItem("snapOutletId", foundOutlet._id);
          setOutlet(prev => ({ ...prev, _id: foundOutlet._id }));
        }
        
        fetchOrders(foundOutlet._id);
      } else {
        setError(`Could not find the ${outletName} outlet.`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching outlet ID:", error);
      setError(`Failed to load ${outletName} information.`);
      setLoading(false);
    }
  };

  const fetchOutletDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/admin/food/my-outlet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOutlet(response.data);

      if (response.data && response.data._id) {
        fetchOrders(response.data._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching outlet details:", error);
      setError("Failed to load outlet details. Please try again later.");
      setLoading(false);
    }
  };

  const fetchOrders = async (outletId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/admin/food/${outletId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API_URL}/admin/food/${outlet._id}/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      fetchOrders(outlet._id);
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOrders = activeStatus === "all"
    ? orders
    : orders.filter((order) => order.status === activeStatus);

  return (
    <PageWrapper direction="down">
      <Layout>
        <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-200">
                {outlet ? `${outlet.name} - Orders Management` : "Food Outlet Management"}
              </h1>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}

            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {["all", "pending", "preparing", "ready", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : !outlet ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <h2 className="text-xl font-medium text-gray-300 mb-2">No outlet assigned</h2>
                <p className="text-gray-500 mb-6">
                  You don't have any food outlet assigned to your account.
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <h2 className="text-xl font-medium text-gray-300 mb-2">No orders found</h2>
                <p className="text-gray-500">
                  No {activeStatus !== "all" ? activeStatus : ""} orders available at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700"
                  >
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-lg text-white font-semibold">
                        Order #{order._id.substring(0, 8)}...
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "preparing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "ready"
                              ? "bg-green-100 text-green-800"
                              : order.status === "completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">
                        Customer: {order.user_id?.name || "Unknown"}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b border-gray-700">
                      <h4 className="text-sm text-gray-400 font-medium mb-2">Items</h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              {item.quantity}x {item.item_id?.name || "Unknown item"}
                            </span>
                            <span className="text-gray-400">
                              ₹{item.item_id?.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="px-4 py-3 flex justify-between items-center">
                      <div>
                        <span className="text-gray-300 text-sm">Total: </span>
                        <span className="text-yellow-400 font-bold">₹{order.total}</span>
                      </div>

                      {order.status !== "completed" && order.status !== "cancelled" && (
                        <div className="flex space-x-2">
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(order._id, "preparing")}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Start Preparing
                            </button>
                          )}

                          {order.status === "preparing" && (
                            <button
                              onClick={() => handleStatusChange(order._id, "ready")}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Mark Ready
                            </button>
                          )}

                          {order.status === "ready" && (
                            <button
                              onClick={() => handleStatusChange(order._id, "completed")}
                              className="px-3 py-1 bg-green-700 text-white text-sm rounded hover:bg-green-800"
                            >
                              Complete
                            </button>
                          )}

                          {order.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(order._id, "cancelled")}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
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