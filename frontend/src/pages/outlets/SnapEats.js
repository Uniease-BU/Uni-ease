import { useState } from "react";
import { FiShoppingCart, FiTrash, FiX } from "react-icons/fi";
import Layout from "../../components/Layout";

// Menu categories and items for Snap Eats
const categories = [
  "Main Course",
  "Starters",
  "Beverages",
  "Desserts",
  "Quick Bites",
  "Sides",
];

const menuItems = {
  "Main Course": [
    {
      id: 101,
      name: "Grilled Chicken Sandwich",
      description: "Juicy grilled chicken with fresh veggies",
      price: 179,
      image: "/images/snap.jpg",
    },
    {
      id: 102,
      name: "Paneer Tikka",
      description: "Cottage cheese marinated in spices and grilled",
      price: 159,
      image: "/images/snap.jpg",
    },
    {
      id: 103,
      name: "Fish & Chips",
      description: "Crispy fish fillet served with French fries",
      price: 299,
      image: "/images/snap.jpg",
    },
    {
      id: 104,
      name: "Vegetable Biryani",
      description: "Fragrant rice cooked with mixed vegetables and spices",
      price: 189,
      image: "/images/snap.jpg",
    },
  ],
  "Starters": [
    {
      id: 105,
      name: "French Fries",
      description: "Crispy golden fried potatoes",
      price: 99,
      image: "/images/snap.jpg",
    },
    {
      id: 106,
      name: "Chicken Wings",
      description: "Spicy chicken wings with dipping sauce",
      price: 189,
      image: "/images/snap.jpg",
    },
    {
      id: 107,
      name: "Onion Rings",
      description: "Crispy battered onion rings",
      price: 109,
      image: "/images/snap.jpg",
    },
  ],
  "Beverages": [
    {
      id: 108,
      name: "Cold Coffee",
      description: "Creamy iced coffee with a hint of chocolate",
      price: 99,
      image: "/images/snap.jpg",
    },
    {
      id: 109,
      name: "Fresh Lime Soda",
      description: "Refreshing lime soda with mint",
      price: 79,
      image: "/images/snap.jpg",
    },
    {
      id: 110,
      name: "Iced Tea",
      description: "Chilled tea with lemon and mint",
      price: 89,
      image: "/images/snap.jpg",
    },
  ],
  "Desserts": [
    {
      id: 111,
      name: "Chocolate Brownie",
      description: "Warm chocolate brownie with ice cream",
      price: 149,
      image: "/images/snap.jpg",
    },
    {
      id: 112,
      name: "Ice Cream Sundae",
      description: "Assorted ice creams with toppings",
      price: 119,
      image: "/images/snap.jpg",
    },
  ],
  "Quick Bites": [
    {
      id: 113,
      name: "Veg Wrap",
      description: "Fresh vegetables wrapped in a tortilla",
      price: 129,
      image: "/images/snap.jpg",
    },
    {
      id: 114,
      name: "Chicken Roll",
      description: "Spicy chicken wrapped in a paratha",
      price: 149,
      image: "/images/snap.jpg",
    },
    {
      id: 115,
      name: "Falafel Plate",
      description: "Crispy chickpea patties with hummus",
      price: 169,
      image: "/images/snap.jpg",
    },
  ],
  "Sides": [
    {
      id: 116,
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter",
      price: 89,
      image: "/images/snap.jpg",
    },
    {
      id: 117,
      name: "Coleslaw",
      description: "Fresh cabbage and carrot salad",
      price: 59,
      image: "/images/snap.jpg",
    },
    {
      id: 118,
      name: "Mashed Potatoes",
      description: "Creamy whipped potatoes with herbs",
      price: 79,
      image: "/images/snap.jpg",
    },
  ],
};

export default function SnapEats() {
  const [selectedCategory, setSelectedCategory] = useState("Main Course");
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
          style={{ backgroundImage: "url('/images/snap.jpg')" }}
        >
          Snap Eats
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