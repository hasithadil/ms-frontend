import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../css/dp/dpHome.css';

function DpHome() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  // Handler for updating order status
  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus, lastUpdated: new Date().toLocaleString() } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  // Handler for logout
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dp-home-container">
      <div className="dp-home-content">
        <nav className="nav-bar">
          <h1 className="nav-title">SwiftTrack - Delivery</h1>
          <div className="nav-links">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Client Home
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Orders
            </NavLink>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
        <div className="delivery-section">
          <h2>Delivery Orders</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Delivery Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.productName}</td>
                    <td>{order.quantity}</td>
                    <td>{order.address}</td>
                    <td>
                      <span
                        className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'In Transit' && (
                        <button
                          className="mark-delivered-btn"
                          onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status === 'Pending' && (
                        <button
                          className="start-delivery-btn"
                          onClick={() => handleUpdateStatus(order.id, 'In Transit')}
                        >
                          Start Delivery
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-orders">No orders assigned yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DpHome;