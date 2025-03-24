import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper"; // Swipe transition wrapper

// Sample recommended food items (to be fetched dynamically later)
const recommendedItems = [
  { id: 1, name: "Cheese Burst Pizza", image: "/images/pizza.jpg" },
  { id: 2, name: "Chicken Biryani", image: "/images/biryani.jpg" },
  { id: 3, name: "Paneer Butter Masala", image: "/images/paneer.jpg" },
  { id: 4, name: "Mango Smoothie", image: "/images/smoothie.jpg" },
  { id: 5, name: "Chocolate Brownie", image: "/images/brownie.jpg" },
];

// Sample outlets (to be fetched dynamically later)
const outlets = [
  {
    id: 1,
    name: "Southern Stories",
    image: "/images/stories.jpg",
    description: "Authentic South Indian flavors served fresh!",
    link: "/southern-stories", // ✅ Corrected link to Southern Stories page
  },
  {
    id: 2,
    name: "Quench",
    image: "/images/quench.jpg",
    description: "Best coffee and snacks in town.",
    link: "#",
  },
  {
    id: 3,
    name: "Snap Eats",
    image: "/images/snap.jpg",
    description: "Authentic spicy flavors from around the world.",
    link: "#",
  },
  {
    id: 4,
    name: "Maggi Hotspot",
    image: "/images/maggi.jpg",
    description: "Delicious grilled delicacies for meat lovers.",
    link: "#",
  },
  {
    id: 5,
    name: "Chai OK Please",
    image: "/images/chai.jpg",
    description: "A paradise for dessert lovers.",
    link: "#",
  },
  {
    id: 6,
    name: "Kathi House",
    image: "/images/food.jpg",
    description: "Nutritious meals for a balanced diet.",
    link: "#",
  },
];

export default function FoodOutlets() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

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
      {" "}
      {/* 🔥 Swipe down transition */}
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen px-16 py-12 space-y-16">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold text-gray-200 drop-shadow-lg">
              Explore Delicious Food Outlets
            </h1>
            <p className="text-lg text-gray-400 max-w-4xl mx-auto">
              Handpicked food from the best outlets in the university, reviewed
              by students.
            </p>
          </div>

          {/* Recommended Items Carousel */}
          <div className="relative w-full max-w-6xl overflow-hidden">
            <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">
              Recommended
            </h2>
            <motion.div
              className="flex space-x-8"
              animate={{ x: hoveredCard ? 0 : [0, -1000] }} // Smooth infinite loop
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            >
              {[...recommendedItems, ...recommendedItems].map((item, index) => (
                <Link
                  key={index}
                  to="#"
                  className="relative w-64 h-64 flex-shrink-0 bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:scale-105 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-center text-white">
                    {item.name}
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Available Outlets - 3x2 Grid Layout */}
          <h2 className="text-3xl font-semibold text-center text-green-400 mb-6">
            Available Outlets
          </h2>
          <div className="grid grid-cols-3 gap-y-16 gap-x-24 w-full max-w-6xl place-items-center">
            {outlets.map((outlet) => (
              <Link
                key={outlet.id}
                to={outlet.link} // ✅ Links correctly to the outlet pages
                className="relative w-96 h-96 flex flex-col items-center justify-start bg-gray-900 bg-opacity-80 backdrop-blur-md border border-gray-700 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, outlet.id)} // Track mouse movement
                onMouseLeave={() => setHoveredCard(null)} // Reset tilt on mouse leave
                style={{
                  transform:
                    hoveredCard === outlet.id
                      ? `perspective(1500px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
                      : "none", // Apply tilt only on the hovered card
                  transition:
                    "transform 0.1s ease-out, box-shadow 0.2s ease-out", // Smooth transition
                  boxShadow:
                    hoveredCard === outlet.id
                      ? "0 10px 30px rgba(0, 0, 0, 0.3)"
                      : "none", // Stronger shadow effect
                }}
              >
                <img
                  src={outlet.image}
                  alt={outlet.name}
                  className="w-full h-60 object-cover opacity-90 rounded-t-3xl"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-white">
                    {outlet.name}
                  </h3>
                  <p className="text-gray-300 text-sm mt-2">
                    {outlet.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}
