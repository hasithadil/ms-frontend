import { useNavigate, NavLink } from 'react-router-dom';
import './../css/Home.css';

// Mock product data (replace with API call in a real implementation)
const mockProducts = [
  {
    id: 'PROD001',
    name: 'Wireless Headphones',
    price: 2999.99,
    image: 'https://via.placeholder.com/250x200?text=Headphones',
  },
  {
    id: 'PROD002',
    name: 'Smartphone Case',
    price: 499.99,
    image: 'https://via.placeholder.com/250x200?text=Case',
  },
  {
    id: 'PROD003',
    name: 'Bluetooth Speaker',
    price: 5999.99,
    image: 'https://via.placeholder.com/250x200?text=Speaker',
  },
  {
    id: 'PROD004',
    name: 'Laptop Backpack',
    price: 2499.99,
    image: 'https://via.placeholder.com/250x200?text=Backpack',
  },
];

function Home() {
  const navigate = useNavigate();

  // Handler for adding an item to an order
  const handleAddToOrder = (productId) => {
    // In a real app, add product to cart state or send to backend
    navigate('/cart');
  };

  // Handler for logout
  const handleLogout = () => {
    // Clear any auth state (e.g., localStorage) if implemented
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="home-content">
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
        <div className="products-section">
          <h2>Products Available</h2>
          <div className="product-grid">
            {mockProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">LKR {product.price.toFixed(2)}</p>
                  <button
                    className="add-to-order-btn"
                    onClick={() => handleAddToOrder(product.id)}
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;