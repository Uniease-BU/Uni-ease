import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Registration failed");
      }

      // Use AuthContext login function instead of directly setting localStorage
      login(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper direction="up">
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
          <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-600">
            <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Register</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:scale-105 hover:ring-4 ring-indigo-300 transition-all duration-300 mt-4"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
              
              <div className="text-center mt-4 text-gray-300">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}

export default RegisterPage;