import { useState } from "react";
import { FiShoppingCart, FiTrash, FiPlus, FiMinus, FiX } from "react-icons/fi";
import Layout from "../../components/Layout";

// Menu categories and items with actual names
const categories = [
  "Snacks",
  "Desserts",
  "Drinks",
  "Main Course",
  "Sides",
  "Breakfast",
  "Combos",
  "Specials",
];

const menuItems = {
  Snacks: [
    {
      id: 1,
      name: "Masala Fries",
      description: "Crispy fries with a spicy twist",
      price: 80,
      image: "/images/mf.jpg",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      description: "Grilled paneer cubes with Indian spices",
      price: 150,
      image: "/images/pt.jpg",
    },
    {
      id: 3,
      name: "Chicken Wings",
      description: "Spicy and crispy chicken wings",
      price: 200,
      image: "/images/cw.jpg",
    },
    {
      id: 4,
      name: "Cheese Balls",
      description: "Fried cheese-filled crispy balls",
      price: 120,
      image: "/images/cbs.jpg",
    },
    {
      id: 5,
      name: "Spring Rolls",
      description: "Crispy rolls stuffed with vegetables",
      price: 100,
      image: "/images/sr.jpg",
    },
    {
      id: 6,
      name: "Chilli Potato",
      description: "Crispy potatoes tossed in spicy sauce",
      price: 110,
      image: "/images/cpt.jpg",
    },
    {
      id: 7,
      name: "Corn Cheese Nuggets",
      description: "Crispy nuggets with melted cheese and corn",
      price: 130,
      image: "/images/corn_cheese_nuggets.jpg",
    },
    {
      id: 8,
      name: "Garlic Bread",
      description: "Toasted bread with garlic and cheese",
      price: 90,
      image: "/images/garlic_bread.jpg",
    },
    {
      id: 9,
      name: "Nachos with Salsa",
      description: "Crispy nachos served with tangy salsa",
      price: 140,
      image: "/images/nachos.jpg",
    },
    {
      id: 10,
      name: "Hakka Noodles",
      description: "Stir-fried noodles with veggies and soy sauce",
      price: 160,
      image: "/images/hakka_noodles.jpg",
    },
  ],
  Desserts: [
    {
      id: 11,
      name: "Chocolate Brownie",
      description: "Rich and fudgy chocolate brownie",
      price: 100,
      image: "/images/chocolate_brownie.jpg",
    },
    {
      id: 12,
      name: "Gulab Jamun",
      description: "Soft and juicy Indian sweet",
      price: 80,
      image: "/images/gulab_jamun.jpg",
    },
  ],
};

export default function SouthernStories() {
  const [selectedCategory, setSelectedCategory] = useState("Snacks");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalCost = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen px-16 py-12 space-y-16">
        <div
          className="w-full h-80 bg-cover bg-center flex items-center justify-center text-white text-5xl font-extrabold"
          style={{ backgroundImage: "url('/images/southern_bg.jpg')" }}
        >
          Southern Stories
        </div>

        <div className="w-full flex justify-center space-x-8 text-white text-lg font-semibold border-b border-gray-700 pb-4">
          {categories.map((category) => (
            <span
              key={category}
              className={`cursor-pointer transition-all ${
                selectedCategory === category
                  ? "text-yellow-400 text-xl"
                  : "hover:text-yellow-300"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-7xl">
          {menuItems[selectedCategory]?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-4 flex flex-col justify-between flex-grow">
                <h3 className="text-2xl text-white font-bold">{item.name}</h3>
                <p className="text-gray-400 text-md mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-yellow-400 text-lg font-semibold">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-500 text-white p-3 rounded-full hover:bg-green-400"
                  >
                    <FiShoppingCart size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isCartOpen && (
          <div className="fixed top-0 right-0 w-96 h-full bg-gray-900 p-6 shadow-lg flex flex-col">
            <div className="flex justify-between text-white text-xl">
              <h2>Cart</h2>
              <FiX
                className="cursor-pointer"
                onClick={() => setIsCartOpen(false)}
              />
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-400 mt-4">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-white mt-4"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <FiTrash
                    className="cursor-pointer text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  />
                </div>
              ))
            )}
            <div className="mt-6 text-white">Total: ₹{getTotalCost()}</div>
          </div>
        )}
      </div>
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-500 p-4 rounded-full text-white"
      >
        <FiShoppingCart size={24} />
      </button>
    </Layout>
  );
}
