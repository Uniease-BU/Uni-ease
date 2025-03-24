import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleMode}
        className="absolute top-4 right-4 p-3 bg-gray-900 text-white rounded-full transition hover:bg-gray-800"
      >
        {isDarkMode ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-blue-500" />
        )}
      </button>

      {/* Render Page Content */}
      {children}
    </div>
  );
}
