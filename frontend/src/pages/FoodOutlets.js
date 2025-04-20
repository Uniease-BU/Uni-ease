import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

// Sample recommended food items
const recommendedItems = [
  { id: 1, name: "Cheese Burst Pizza", image: "/images/cbp.jpg" },
  { id: 2, name: "Chicken Biryani", image: "/images/cb.jpg" },
  { id: 3, name: "Paneer Butter Masala", image: "/images/pbm.jpg" },
  { id: 4, name: "Mango Smoothie", image: "/images/ms.jpg" },
  { id: 5, name: "Chocolate Brownie", image: "/images/cbr.jpg" },
];

// Only showing Southern Stories and Snap Eats as requested
const outlets = [
  {
    id: 1,
    name: "Southern Stories",
    image: "/images/stories.jpg",
    description: "Authentic South Indian flavors served fresh!",
    link: "/southern-stories",
    operatingHours: "9:00 AM - 9:00 PM"
  },
  {
    id: 2,
    name: "Snap Eats",
    image: "/images/snap.jpg",
    description: "Authentic spicy flavors from around the world.",
    link: "/snap-eats",
    operatingHours: "8:00 AM - 10:00 PM"
  }
];

export default function FoodOutlets() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [featuredItems, setFeaturedItems] = useState(recommendedItems);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Function to track mouse movement and tilt effect
  const handleMouseMove = (e, cardId) => {
    const card = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - card.left) / card.width - 0.5; // x-axis
    const offsetY = (e.clientY - card.top) / card.height - 0.5; // y-axis
    setTilt({ x: offsetX * 30, y: offsetY * 30 }); // Multiply for more/less tilt
    setHoveredCard(cardId); // Track hovered card
  };

  return (
    <PageWrapper direction="down">
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 lg:px-16 py-12 space-y-8 sm:space-y-16">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-200 drop-shadow-lg">
              Explore Delicious Food Outlets
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-4xl mx-auto">
              Handpicked food from the best outlets in the university, reviewed
              by students.
            </p>
          </div>

          {/* View My Orders Button */}
          <div>
            <button
              onClick={() => navigate("/my-orders")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              View My Orders
            </button>
          </div>

          {/* Recommended Items Carousel */}
          <div className="relative w-full max-w-6xl overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-400 mb-6">
              Recommended
            </h2>
            <motion.div
              className="flex space-x-4 sm:space-x-8"
              animate={{ x: hoveredCard ? 0 : [0, -1000] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            >
              {[...featuredItems, ...featuredItems].map((item, index) => (
                <div
                  key={index}
                  className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:scale-105 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-center text-white">
                    {item.name}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Available Outlets - 2x1 Grid Layout */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-green-400 mb-6">
            Choose an Outlet
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 w-full max-w-6xl place-items-center">
            {outlets.map((outlet) => (
              <Link
                key={outlet.id}
                to={outlet.link}
                className="relative w-full max-w-md h-96 flex flex-col items-center justify-start bg-gray-900 bg-opacity-80 backdrop-blur-md border border-gray-700 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, outlet.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform:
                    hoveredCard === outlet.id
                      ? `perspective(1500px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
                      : "none",
                  transition:
                    "transform 0.1s ease-out, box-shadow 0.2s ease-out",
                  boxShadow:
                    hoveredCard === outlet.id
                      ? "0 10px 30px rgba(0, 0, 0, 0.3)"
                      : "none",
                }}
              >
                <img
                  src={outlet.image}
                  alt={outlet.name}
                  className="w-full h-60 object-cover opacity-90 rounded-t-3xl"
                />
                <div className="p-4 text-center w-full">
                  <h3 className="text-xl font-bold text-white">
                    {outlet.name}
                  </h3>
                  <p className="text-gray-300 text-sm mt-2">
                    {outlet.description}
                  </p>
                  <p className="text-yellow-400 text-sm mt-2">
                    Hours: {outlet.operatingHours}
                  </p>
                  <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full">
                    Order Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}
