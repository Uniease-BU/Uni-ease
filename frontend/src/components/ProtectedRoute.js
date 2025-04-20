import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require authentication and optionally admin role
const ProtectedRoute = ({ children, adminOnly = false, adminType = null }) => {
  const { isAuthenticated, isAdmin, getAdminType } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If admin only route and user is not admin, redirect to home
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Check for specific admin type restriction
  if (adminOnly && adminType) {
    const currentAdminType = getAdminType();
    
    // Special handling for food admin routes
    if (adminType === 'food') {
      // Allow southern and snap admin types to access food admin routes
      if (currentAdminType === 'southern' || currentAdminType === 'snap' || currentAdminType === 'food') {
        return children;
      }
    } 
    // For other routes, exact match required
    else if (currentAdminType === adminType) {
      return children;
    }
    
    // If wrong admin type, redirect to the correct admin page or home
    if (currentAdminType) {
      // For southern and snap admins, redirect to food dashboard
      if (currentAdminType === 'southern' || currentAdminType === 'snap') {
        return <Navigate to="/admin/food" replace />;
      }
      return <Navigate to={`/admin/${currentAdminType}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If authenticated (and has admin role if required), render the protected component
  return children;
};

export default ProtectedRoute;