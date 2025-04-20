import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// AdminRoute component to restrict access to admin routes and redirect to appropriate service
const AdminRoute = ({ children }) => {
  const { isAuthenticated, userData } = useAuth();
  const [adminType, setAdminType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      // Check admin type based on email
      if (userData && userData.email) {
        if (userData.email.includes('laundry')) {
          setAdminType('laundry');
        } else if (userData.email.includes('salon')) {
          setAdminType('salon');
        } else if (userData.email.includes('food')) {
          setAdminType('food');
        }
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, userData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // If not authenticated or not an admin, redirect to login
  if (!isAuthenticated() || userData?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  // Redirect to specific admin dashboard based on email
  if (adminType === 'laundry') {
    return <Navigate to="/admin/laundry" />;
  } else if (adminType === 'salon') {
    return <Navigate to="/admin/salon" />;
  } else if (adminType === 'food') {
    return <Navigate to="/admin/food" />;
  }

  // If no specific admin type found, redirect to home
  return <Navigate to="/" />;
};

export default AdminRoute;