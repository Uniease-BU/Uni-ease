import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // Import animation wrapper
import Home from "./pages/Home";
import Laundry from "./pages/Laundry";
import Salon from "./pages/Salon";
import FoodOutlets from "./pages/FoodOutlets";
import Maps from "./pages/Maps";
import SouthernStories from "./pages/outlets/Southern"; // Import the new Southern page

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/laundry" element={<Laundry />} />
        <Route path="/salon" element={<Salon />} />
        <Route path="/food-outlets" element={<FoodOutlets />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/southern-stories" element={<SouthernStories />} />{" "}
        {/* Add the route for Southern Stories */}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
