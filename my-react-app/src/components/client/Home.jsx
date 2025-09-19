import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../css/client/Home.css';
import axios from 'axios';


function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and load products from localStorage
  // useEffect(() => {
  //   const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
  //   if (storedProducts.length === 0) {
  //     // Default products if none exist
  //     const defaultProducts = [];
  //     localStorage.setItem('products', JSON.stringify(defaultProducts));
  //   } else {
  //     setProducts(storedProducts);
  //   }
  // }, []);
useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.get('http://localhost:8085/wms/items/getAllItems', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Response:", response);
      console.log("Response data:", response.data);

      //setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Handler for adding an item to an order
  const handleAddToOrder = (product) => {
    // Pass product to cart page via state
    navigate('/cart', { state: { product } });
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
        {/* Products Section */}
        {products.length > 0 && (
          <div className="products-section">
            <h2>Products Available</h2>
            <div className="product-grid">
              {products.map((product) => (
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
                      onClick={() => handleAddToOrder(product)}
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;