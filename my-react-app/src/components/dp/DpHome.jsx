import { useNavigate , NavLink} from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../css/dp/dpHome.css';
import { Package, Locate } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DpHome() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    axios
      .get('http://localhost:8085/cms/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const notDelivered = res.data.filter((order) => order.status === 'NOT_DELIVERED');
        setOrders(notDelivered);
      })
      .catch(() => toast.error('Failed to fetch orders'));
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    axios
      .post(
        'http://localhost:8085/wms/v1/updatePackageState',
        { orderid: orderId, state: 'DELIVERED', remarks: 'Delivered' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      })
      .catch(() => toast.error('Failed to update order'));
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  return (
    <div className="">
                  <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-blue-600">SwiftTrack</h1>
        <div className="flex gap-6 items-center">
          <NavLink
            to="/dphome"
            className={({ isActive }) =>
              `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
            }
          >
            Home
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="dp-home-content mt-10">
        {/* Navbar */}


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
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-orders">
                      No orders assigned yet.
                    </td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.item.name}</td>
                    <td>{order.quantity}</td>
                    <td>{order.address}</td>
                    <td>
                      <span
                        className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      {order.status === 'NOT_DELIVERED' && (
                        <>
                          <button
                            className="mark-delivered-btn"
                            onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                          >
                            Mark Delivered
                          </button>
          
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
                          <button
                            className="start-delivery-btn mt-6"
                            onClick={() => navigate('/path')}
                          >
                            View Routing Path
                          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default DpHome;