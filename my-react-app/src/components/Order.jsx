import { useNavigate, NavLink } from 'react-router-dom';
import '../css/Order.css';

// Mock order data (replace with API call in a real implementation)
const mockOrders = [
  { id: 'ORD001', status: 'Pending', address: '123 Main St, Colombo', lastUpdated: '2025-09-19 09:00 AM' },
  { id: 'ORD002', status: 'In Warehouse', address: '456 Galle Rd, Kandy', lastUpdated: '2025-09-19 08:30 AM' },
  { id: 'ORD003', status: 'In Transit', address: '789 Beach Rd, Galle', lastUpdated: '2025-09-19 07:45 AM' },
  { id: 'ORD004', status: 'Delivered', address: '101 Park Ave, Negombo', lastUpdated: '2025-09-18 03:00 PM' },
];

function Orders() {
  const navigate = useNavigate();

  // Handler for tracking an order (mock implementation)
  const handleTrack = (orderId) => {
    alert(`Tracking order ${orderId}... (Real-time tracking not implemented in UI prototype)`);
    // In a real app, this could navigate to a tracking page or fetch real-time data
  };

  // Handler for logout
  const handleLogout = () => {
    // Clear any auth state (e.g., localStorage) if implemented
    navigate('/');
  };

  return (
    <div className="orders-container">
      <div className="orders-content">
        <nav className="nav-bar">
          <h1 className="nav-title">SwiftTrack</h1>
          <div className="nav-links">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Home
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
        <div className="orders-section">
          <h2>Your Orders</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Delivery Address</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <span
                        className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.address}</td>
                    <td>{order.lastUpdated}</td>
                    <td>
                      <button
                        className="track-btn"
                        onClick={() => handleTrack(order.id)}
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;