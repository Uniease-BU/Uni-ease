import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [adminType, setAdminType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in by token presence and get user info
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Try to get user info from token - this assumes you have a /me endpoint
          // If you don't have such an endpoint, you might need to decode the JWT instead
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data) {
            setCurrentUser(response.data);
            setUserRole(response.data.role);
            setUserData(response.data);
            
            // Determine admin type based on email
            if (response.data.role === 'admin' && response.data.email) {
              if (response.data.email.includes('laundry')) {
                setAdminType('laundry');
              } else if (response.data.email.includes('salon')) {
                setAdminType('salon');
              } else if (response.data.email.includes('food')) {
                setAdminType('food');
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // If there's an error (e.g., token expired), clear storage
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setCurrentUser(userData);
    setUserRole(userData?.role || null);
    setUserData(userData);
    
    // Determine admin type based on email
    if (userData?.role === 'admin' && userData.email) {
      let type = null;
      
      if (userData.email.includes('laundry')) {
        type = 'laundry';
      } else if (userData.email.includes('salon')) {
        type = 'salon';
      } else if (userData.email.includes('food')) {
        type = 'food';
      }
      
      setAdminType(type);
      
      // Redirect to specific admin page
      if (type) {
        navigate(`/admin/${type}`);
        return;
      }
    }

    navigate('/');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setUserRole(null);
    setUserData(null);
    setAdminType(null);
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if user is admin
  const isAdmin = () => {
    return userRole === 'admin';
  };

  // Get admin type
  const getAdminType = () => {
    return adminType;
  };

  // Check if user is specific type of admin
  const isSpecificAdmin = (type) => {
    return isAdmin() && adminType === type;
  };

  // Context value
  const value = {
    currentUser,
    userRole,
    userData,
    adminType,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    getAdminType,
    isSpecificAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;