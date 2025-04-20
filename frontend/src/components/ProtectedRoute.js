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
  if (adminOnly && adminType && getAdminType() !== adminType) {
    // If wrong admin type, redirect to the correct admin page or home
    const currentAdminType = getAdminType();
    if (currentAdminType) {
      return <Navigate to={`/admin/${currentAdminType}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If authenticated (and has admin role if required), render the protected component
  return children;
};

export default ProtectedRoute;