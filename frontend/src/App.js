import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // Import animation wrapper
import Home from "./pages/Home";
import Laundry from "./pages/Laundry";
import Salon from "./pages/Salon";
import LoginPage from "./pages/Login";
import FoodOutlets from "./pages/FoodOutlets";
import Maps from "./pages/Maps";
import SouthernStories from "./pages/outlets/Southern"; // Import the new Southern page
import AdminLaundry from "./pages/admin/AdminLaundry"; // Import the AdminLaundry component
import AdminSalon from "./pages/admin/AdminSalon"; // Import the AdminSalon component
import Register from "./pages/Register"; // Import the Register page
import MyLaundry from "./pages/MyLaundry"; // Import MyLaundry component
import MySalonBookings from "./pages/MySalonBookings"; // Import MySalonBookings component
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import AdminRoute from "./components/AdminRoute"; // Import the AdminRoute component

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        
        {/* Protected Routes */}
        <Route 
          path="/laundry" 
          element={
            <ProtectedRoute>
              <Laundry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-laundry" 
          element={
            <ProtectedRoute>
              <MyLaundry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/salon" 
          element={
            <ProtectedRoute>
              <Salon />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-salon-bookings" 
          element={
            <ProtectedRoute>
              <MySalonBookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/food-outlets" 
          element={
            <ProtectedRoute>
              <FoodOutlets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/southern-stories" 
          element={
            <ProtectedRoute>
              <SouthernStories />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes with Role-Based Access */}
        <Route 
          path="/admin" 
          element={<AdminRoute />}
        />
        
        <Route 
          path="/admin/laundry" 
          element={
            <ProtectedRoute adminOnly={true} adminType="laundry">
              <AdminLaundry />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/salon" 
          element={
            <ProtectedRoute adminOnly={true} adminType="salon">
              <AdminSalon />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes */}
        <Route path="/maps" element={<Maps />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
