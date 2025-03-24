import { Link } from "react-router-dom";
import Layout from "../components/Layout"; // Import Layout component

export default function Home() {
  const services = [
    {
      title: "Laundry",
      description:
        "Get your laundry done effortlessly with our reliable and quick services.",
      color: "text-blue-400",
      link: "/laundry",
      image: "/images/laundry.jpg",
      animationClass: "hover:animate-smallHover1",
    },
    {
      title: "Salon",
      description:
        "Pamper yourself with our top-notch salon services. Haircuts, spa, and more!",
      color: "text-pink-400",
      link: "/salon",
      image: "/images/salon.jpg",
      animationClass: "hover:animate-smallHover2",
    },
    {
      title: "Food Outlets",
      description:
        "Explore a variety of delicious food with different outlets options around you.",
      color: "text-green-400",
      link: "/food-outlets",
      image: "/images/food.jpg",
      animationClass: "hover:animate-smallHover3",
    },
    {
      title: "Maps",
      description:
        "Navigate through the university with detailed maps of each block/building.",
      color: "text-purple-400",
      link: "/Maps",
      image: "/images/map.png",
      animationClass: "hover:animate-smallHover4",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 lg:py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-200 drop-shadow-lg text-shadow-md">
            Welcome to <span className="text-blue-400">UniEase</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Your one-stop solution for all essential university services.
          </p>
        </div>

        {/* 2x2 Grid Layout with Equal Card Heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 place-items-center">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-gray-800 bg-opacity-80 backdrop-blur-md border border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden w-full max-w-md min-h-[400px] transform hover:translate-y-2 ${service.animationClass}`}
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover opacity-90 rounded-t-3xl"
              />

              {/* Card Content */}
              <div className="p-6 text-center flex flex-col justify-between h-full">
                <div>
                  <h2
                    className={`text-3xl font-bold hover:text-gray-300 ${service.color}`}
                  >
                    {service.title}
                  </h2>
                  <p className="text-gray-300 mt-4">{service.description}</p>
                </div>
                {/* Stylish Button with Hover Effect */}
                <Link
                  to={service.link}
                  className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-full shadow-md hover:scale-105 hover:from-indigo-500 hover:to-blue-500 hover:ring-2 ring-indigo-300 transition-all duration-300"
                >
                  Open {service.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
