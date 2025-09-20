import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../css/client/order.css";
import axios from "axios";

// Load orders from localStorage
function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  //   setOrders(storedOrders);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get(
          `http://localhost:8085/cms/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const filteredOrders = response.data.filter((order) => order.status !== "CANCELLED");
        console.log(response.data);

        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Handler for logout
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="">
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-blue-600">SwiftTrack</h1>
        <div className="flex gap-6 items-center">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
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
      <div className="orders-content">
        
        <div className="orders-section">
          <h2>Your Orders</h2>
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : error ? (
            <div className="error">Error loading orders. Please try again.</div>
          ) : (
            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="no-orders">No orders placed yet.</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-id">Order #{order.id}</div>
                        <div className="order-date">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      <div className="order-actions">
                        <span
                          className={`status-badge status-${order.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {order.status}
                        </span>
                        <button
                          className="track-btn"
                          onClick={() => navigate(`/track/${order.id}`)}
                        >
                          Track Order
                        </button>
                      </div>
                    </div>

                    <div className="order-body">
                      <div className="product-info">
                        <h3>{order.item.name}</h3>
                        <p className="product-description">
                          {order.item.description}
                        </p>
                        <div className="product-details">
                          <span className="sku">SKU: {order.item.sku}</span>
                          <span className="price">
                            Unit Price: LKR {order.item.price}
                          </span>
                        </div>
                      </div>

                      <div className="order-details">
                        <div className="detail-row">
                          <span className="label">Quantity:</span>
                          <span className="value">{order.quantity}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Shipping Fee:</span>
                          <span className="value">LKR {order.shippingFee}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Payment Method:</span>
                          <span className="value">{order.paymentMethod}</span>
                        </div>
                        <div className="detail-row total">
                          <span className="label">Total Price:</span>
                          <span className="value">LKR {order.totalPrice}</span>
                        </div>
                      </div>

                      <div className="delivery-info">
                        <h4>Delivery Address</h4>
                        <p>{order.address}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
