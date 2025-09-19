import { useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import '../../css/wm/wmHome.css';

function WmHome() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');

  // Handler for adding a product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: `PROD${Date.now()}`, // Simple unique ID for prototype
      name: productName,
      price: parseFloat(productPrice),
      image: productImage || 'https://via.placeholder.com/250x200?text=Product',
    };
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    storedProducts.push(newProduct);
    localStorage.setItem('products', JSON.stringify(storedProducts));
    alert('Product added successfully! Check the client Home page.');
    // Reset form
    setProductName('');
    setProductPrice('');
    setProductImage('');
  };

  // Handler for logout
  const handleLogout = () => {
    // Clear any auth state (e.g., localStorage) if implemented
    navigate('/');
  };

  return (
    <div className="wm-home-container">
      <div className="wm-home-content">
        <nav className="nav-bar">
          <h1 className="nav-title">SwiftTrack - Warehouse</h1>
          <div className="nav-links">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Client
            </NavLink>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
        <div className="add-product-section">
          <h2>Add New Product</h2>
          <form className="add-product-form" onSubmit={handleAddProduct}>
            <div className="form-group">
              <label htmlFor="productName">Product Name:</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="productPrice">Price (LKR):</label>
              <input
                type="number"
                id="productPrice"
                step="0.01"
                min="0"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="productImage">Image URL (optional):</label>
              <input
                type="url"
                id="productImage"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="add-product-btn">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WmHome;