import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../../css/client/cart.css';

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {}; // Get product from state
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');

  // Handler for logout
  const handleLogout = () => {
    // Clear any auth state (e.g., localStorage) if implemented
    navigate('/');
  };

  // Handler for form submission
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!product) return;
    const newOrder = {
      id: `ORD${Date.now()}`, // Simple unique ID for prototype
      productName: product.name,
      productId: product.id,
      quantity,
      address,
      status: 'Pending', // Initial status
      lastUpdated: new Date().toLocaleString(),
    };
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    storedOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(storedOrders));
    alert(
      `Order submitted successfully for ${quantity} x ${product.name} to ${address}! (Check Orders or DP page)`
    );
    // In a real app, send order to middleware (e.g., CMS via SOAP)
    // Reset form and clear state
    setQuantity(1);
    setAddress('');
    navigate('/orders'); // Redirect to orders page after submission
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
              to="/order"
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
          {!product ? (
            <p className="cart-empty">
              Your cart is empty. Add products from the home page to create an order.
            </p>
          ) : (
            <div className="cart-item">
              <img
                src={product.image}
                alt={product.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{product.name}</h3>
                <p className="cart-item-price">LKR {product.price.toFixed(2)}</p>
              </div>
              <form className="cart-form" onSubmit={handleSubmitOrder}>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Delivery Address:</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <button type="submit" className="submit-order-btn">
                  Submit Order
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;