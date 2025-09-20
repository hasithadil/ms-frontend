import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Same helper function as Home.jsx
const getProductImage = (productName) => {
  const name = productName.toLowerCase();
  if (name.includes("pen") || name.includes("pencil")) {
    return "https://img.drz.lazcdn.com/3rd/q/aHR0cHM6Ly9wc3BrLmxvbmdwZWFuLmNvbS8xNjkwNTE0MjQwNjE5LzM1OTk5MDYwNzE4OTIyMTYwLmpwZz9pbWFnZU1vZ3IyL3RodW1ibmFpbC8xMDAweDEwMDAh_960x960q80.png_.webp";
  }
  if (name.includes("eraser")) {
    return "https://m.media-amazon.com/images/I/81kov-vHJZL._UF1000,1000_QL80_.jpg";
  }
  if (name.includes("book") || name.includes("notebook")) {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHvEC4YAo6J_dbVfzp_poDijCItGVLObSRPQ&s";
  }
  if (name.includes("laptop")) {
    return "https://lap.lk/wp-content/uploads/2023/01/78a17af1-1690-4704-b497-a19e3b7b6574-300x300.jpg.webp";
  }
  if (name.includes("desktop") || name.includes("pc")) {
    return "https://m.media-amazon.com/images/I/81JlCSDZ3AL.jpg";
  }
  return "https://m.media-amazon.com/images/I/81JlCSDZ3AL.jpg";
};

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {}; // Get product from state
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  // Fetch item details
  useEffect(() => {
    if (!product?.id) return;

    const token = localStorage.getItem("jwtToken");
    axios
      .get(`http://localhost:8085/cms/items/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setItem(res.data))
      .catch((err) => {
        console.error("Error fetching item:", err);
        toast.error("Failed to load item details");
      });
  }, [product]);

  // Submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!item) return;

    if (quantity > item.stock) {
      toast.error(`Only ${item.stock} available in stock`);
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId"); // assuming userId is stored after login
    const shippingFee = 5.0;
    const totalPrice = item.price * quantity + shippingFee;

    const orderData = {
      address,
      userId: Number(userId) || 1, // fallback to 1
      quantity,
      totalPrice,
      shippingFee,
      paymentMethod: "COD",
      item: { id: item.id },
    };

    try {
      await axios.post("http://localhost:8085/cms/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!");
      setQuantity(1);
      setAddress("");
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SwiftTrack</h1>
        <div className="flex gap-6 items-center">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
              }`
            }
          >
            Orders
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <div className="max-w-3xl mx-auto p-6">
        {!item ? (
          <div className="text-center text-gray-500 mt-20">Loading item...</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
            {/* Product Info */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={getProductImage(item.name)}
                alt={item.name}
                className="w-40 h-40 object-cover rounded-md"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {item.name}
                </h2>
                <p className="text-gray-500 mb-2">{item.description}</p>
                <p className="text-lg font-semibold text-blue-600">
                  LKR {item.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {item.stock ?? "N/A"}
                </p>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Place Order
              </button>
            </form>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Cart;