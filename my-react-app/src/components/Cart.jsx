import { useNavigate, NavLink } from 'react-router-dom';
import '../css/Cart.css';

function Cart() {
  const navigate = useNavigate();

  // Handler for logout
  const handleLogout = () => {
    // Clear any auth state (e.g., localStorage) if implemented
    navigate('/');
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
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
        <div className="cart-section">
          <h2>Your Cart</h2>
          <p className="cart-empty">
            Your cart is empty. Add products from the home page to create an order.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cart;