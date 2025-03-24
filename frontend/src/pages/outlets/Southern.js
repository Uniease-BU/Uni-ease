import { useState } from "react";
import { FiShoppingCart, FiTrash, FiPlus, FiMinus } from "react-icons/fi";
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
      image: "/images/masala_fries.jpg",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      description: "Grilled paneer cubes with Indian spices",
      price: 150,
      image: "/images/paneer_tikka.jpg",
    },
    {
      id: 3,
      name: "Chicken Wings",
      description: "Spicy and crispy chicken wings",
      price: 200,
      image: "/images/chicken_wings.jpg",
    },
    {
      id: 4,
      name: "Cheese Balls",
      description: "Fried cheese-filled crispy balls",
      price: 120,
      image: "/images/cheese_balls.jpg",
    },
    {
      id: 5,
      name: "Spring Rolls",
      description: "Crispy rolls stuffed with vegetables",
      price: 100,
      image: "/images/spring_rolls.jpg",
    },
    {
      id: 6,
      name: "Chilli Potato",
      description: "Crispy potatoes tossed in spicy sauce",
      price: 110,
      image: "/images/chilli_potato.jpg",
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
    {
      id: 13,
      name: "Ice Cream Sundae",
      description: "Vanilla ice cream with chocolate syrup",
      price: 120,
      image: "/images/ice_cream_sundae.jpg",
    },
    {
      id: 14,
      name: "Rasgulla",
      description: "Spongy cottage cheese balls in syrup",
      price: 90,
      image: "/images/rasgulla.jpg",
    },
    {
      id: 15,
      name: "Fruit Custard",
      description: "Chilled custard with mixed fruits",
      price: 110,
      image: "/images/fruit_custard.jpg",
    },
    {
      id: 16,
      name: "Mango Mousse",
      description: "Smooth and creamy mango dessert",
      price: 130,
      image: "/images/mango_mousse.jpg",
    },
    {
      id: 17,
      name: "Kaju Katli",
      description: "Traditional Indian cashew sweet",
      price: 140,
      image: "/images/kaju_katli.jpg",
    },
    {
      id: 18,
      name: "Tiramisu",
      description: "Classic Italian coffee-flavored dessert",
      price: 150,
      image: "/images/tiramisu.jpg",
    },
    {
      id: 19,
      name: "Strawberry Cheesecake",
      description: "Creamy cheesecake with fresh strawberries",
      price: 160,
      image: "/images/strawberry_cheesecake.jpg",
    },
    {
      id: 20,
      name: "Choco Lava Cake",
      description: "Molten chocolate-filled cake",
      price: 170,
      image: "/images/choco_lava_cake.jpg",
    },
  ],
};

export default function SouthernStories() {
  const [selectedCategory, setSelectedCategory] = useState("Snacks");
  const [cart, setCart] = useState([]);

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

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen px-16 py-12 space-y-16">
        {/* Hero Section */}
        <div
          className="w-full h-80 bg-cover bg-center flex items-center justify-center text-white text-5xl font-extrabold"
          style={{ backgroundImage: "url('/images/southern_bg.jpg')" }}
        >
          Southern Stories
        </div>

        {/* Category Navigation */}
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

        {/* Menu Items Display */}
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
      </div>
    </Layout>
  );
}
