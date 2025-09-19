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
          `http://localhost:8085/cms/orders/getOrders/${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //console.log(response.data);
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
    <div className="orders-container">
      <div className="orders-content">
        <nav className="nav-bar">
          <h1 className="nav-title">SwiftTrack</h1>
          <div className="nav-links">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/order"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Orders
            </NavLink>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
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
                      <div className="order-id">Order #{order.id}</div>
                      <div className="order-date">
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <span
                        className={`status-badge status-${order.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
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
                            Unit Price: ${order.item.price}
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
                          <span className="value">${order.shippingFee}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Payment Method:</span>
                          <span className="value">{order.paymentMethod}</span>
                        </div>
                        <div className="detail-row total">
                          <span className="label">Total Price:</span>
                          <span className="value">${order.totalPrice}</span>
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
