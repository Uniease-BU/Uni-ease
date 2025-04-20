import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FiUser, FiLogOut, FiHome, FiShoppingBag } from "react-icons/fi";

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const { isAuthenticated, logout, isAdmin, adminType } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  // Load theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    } else {
      setIsDarkMode(true); // Default to dark mode
    }
  }, []);

  // Apply theme and store in localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Toggle Theme Mode
  const toggleMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  // Check if the current route is an admin route
  const isAdminPage = location.pathname.includes('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation Bar */}
      <header className="w-full p-4 flex justify-between items-center bg-gray-900 shadow-md z-10">
        <div className="flex items-center space-x-4">
          {/* Logo links to home or admin dashboard based on user role */}
          <Link 
            to={isAdmin() ? `/admin/${adminType}` : "/"} 
            className="text-xl font-bold text-white"
          >
            {isAdmin() ? `${adminType?.toUpperCase()} Admin` : "Uni-Ease"}
          </Link>

          {/* Show specific admin navigation if user is an admin */}
          {isAdmin() && (
            <nav className="hidden md:flex space-x-4">
              {adminType === 'laundry' && (
                <>
                  <Link 
                    to="/admin/laundry" 
                    className={`text-sm ${location.pathname === '/admin/laundry' ? 'text-blue-400' : 'text-gray-300 hover:text-white'} transition-colors`}
                  >
                    Laundry Dashboard
                  </Link>
                </>
              )}
              
              {adminType === 'salon' && (
                <>
                  <Link 
                    to="/admin/salon" 
                    className={`text-sm ${location.pathname === '/admin/salon' ? 'text-blue-400' : 'text-gray-300 hover:text-white'} transition-colors`}
                  >
                    Salon Dashboard
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Show regular navigation for non-admin users */}
          {!isAdmin() && isAuthenticated() && !isAdminPage && (
            <nav className="hidden md:flex space-x-4">
              <Link 
                to="/laundry" 
                className={`text-sm ${location.pathname === '/laundry' ? 'text-blue-400' : 'text-gray-300 hover:text-white'} transition-colors`}
              >
                Laundry
              </Link>
              <Link 
                to="/salon" 
                className={`text-sm ${location.pathname === '/salon' ? 'text-blue-400' : 'text-gray-300 hover:text-white'} transition-colors`}
              >
                Salon
              </Link>
              <Link 
                to="/food-outlets" 
                className={`text-sm ${location.pathname === '/food-outlets' ? 'text-blue-400' : 'text-gray-300 hover:text-white'} transition-colors`}
              >
                Food
              </Link>
              <Link 
                to="/maps" 
                className={`text-sm ${location.pathname === '/maps' ? 'text-blue-400' : 'text-gray-300 hover:text-white'} transition-colors`}
              >
                Maps
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleMode}
            className="p-2 rounded-full hover:bg-gray-800 transition-all"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-blue-500" />
            )}
          </button>
          
          {/* User Profile Section */}
          {isAuthenticated() ? (
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
                aria-label="User menu"
              >
                <FiUser className="w-5 h-5 text-white" />
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    {isAdmin() ? `${adminType} Admin` : 'User Account'}
                  </div>
                  
                  {isAdmin() ? (
                    <Link 
                      to={`/admin/${adminType}`}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiShoppingBag className="mr-2" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiHome className="mr-2" />
                      Home
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-all"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-all"
            >
              <FiUser className="mr-1" />
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center">
        {children}
      </main>
    </div>
  );
}
