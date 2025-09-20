import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const imageMap = {
  pen: 'https://img.drz.lazcdn.com/3rd/q/aHR0cHM6Ly9wc3BrLmxvbmdwZWFuLmNvbS8xNjkwNTE0MjQwNjE5LzM1OTk5MDYwNzE4OTIyMTYwLmpwZz9pbWFnZU1vZ3IyL3RodW1ibmFpbC8xMDAweDEwMDAh_960x960q80.png_.webp',
  eraser: 'https://m.media-amazon.com/images/I/81kov-vHJZL._UF1000,1000_QL80_.jpg',
  books: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHvEC4YAo6J_dbVfzp_poDijCItGVLObSRPQ&s',
  laptop: 'https://lap.lk/wp-content/uploads/2023/01/78a17af1-1690-4704-b497-a19e3b7b6574-300x300.jpg.webp',
  desktop: 'https://m.media-amazon.com/images/I/81JlCSDZ3AL.jpg',
  pc: 'https://m.media-amazon.com/images/I/81JlCSDZ3AL.jpg',
};

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('http://localhost:8085/cms/items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToOrder = (product) => {
    navigate('/cart', { state: { product } });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate('/');
  };

  return (
    <div >
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 animate-pulse">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load products</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">No products available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const lowerName = product.name.toLowerCase();
              const imageUrl = Object.keys(imageMap).find(key => lowerName.includes(key)) ? imageMap[Object.keys(imageMap).find(key => lowerName.includes(key))] : 'https://images-cdn.ubuy.co.in/633fd4eb4636915ef8105f42-2022-storage-box-electronic-products.jpg';
              return (
                <div
                  key={product.id}
                  className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between hover:shadow-lg transition transform hover:scale-105"
                >
                  {/* Product Image */}
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                  />

                  {/* Product Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                    <p className="text-blue-600 font-bold text-lg">
                      LKR {product.price.toLocaleString()}
                    </p>
                    {product.stock !== null && (
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleAddToOrder(product)}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Buy Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;