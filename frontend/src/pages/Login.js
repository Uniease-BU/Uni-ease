import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle admin credentials prefill (for demonstration purposes)
  const prefillAdminCredentials = () => {
    setEmail("laundry@example.com");
    setPassword("strongpassword123");
    setIsAdminLogin(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Get user data including role
      const userResponse = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await userResponse.json();
      
      // Pass both token and user data to login function
      login(data.token, userData);
      
      // Redirect based on role
      if (userData.role === "admin" && isAdminLogin) {
        navigate("/admin/laundry");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper direction="left">
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
          <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-700">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
              {isAdminLogin ? "Admin Login" : "Login"}
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white py-3 px-6 rounded-full shadow-lg mt-4 ${!loading ? 'hover:scale-105 hover:ring-4 ring-indigo-300' : 'opacity-70'} transition-all duration-300`}
              >
                {loading ? "Logging in..." : isAdminLogin ? "Login as Admin" : "Login"}
              </button>
              
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
              
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Register
                  </Link>
                </p>
              </div>
              
              {/* Admin login toggle */}
              <div className="text-center mt-2">
                <button 
                  type="button"
                  onClick={() => {
                    if (!isAdminLogin) {
                      prefillAdminCredentials();
                    } else {
                      setEmail("");
                      setPassword("");
                      setIsAdminLogin(false);
                    }
                  }}
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  {isAdminLogin ? "Switch to Regular Login" : "Admin Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}

export default LoginPage;
