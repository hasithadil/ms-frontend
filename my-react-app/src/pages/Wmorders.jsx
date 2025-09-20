import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WmOrders() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [ordersMap, setOrdersMap] = useState({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    axios
      .get('http://localhost:8085/wms/v1/GetAll', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPackages(res.data);
        res.data.forEach((pkg) => {
          axios
            .get(`http://localhost:8085/cms/orders/${pkg.packageId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((orderRes) => {
              setOrdersMap((prev) => ({ ...prev, [pkg.packageId]: orderRes.data }));
            })
            .catch(() => toast.error(`Failed to fetch order ${pkg.packageId}`));
        });
      })
      .catch(() => toast.error('Failed to fetch packages'));
  }, []);

  const updatePackageStatus = (pkgId, newStatus) => {
    axios
      .post(
        'http://localhost:8085/wms/v1/updatePackageState',
        { orderid: pkgId, state: newStatus, remarks: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(`Package ${pkgId} updated to ${newStatus}`);
        setPackages((prev) =>
          prev.map((p) => (p.packageId === pkgId ? { ...p, status: newStatus } : p))
        );
      })
      .catch(() => toast.error('Failed to update package'));
  };

  // Apply filter
  const filteredPackages =
    statusFilter === 'ALL'
      ? packages
      : packages.filter((pkg) => pkg.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SwiftTrack</h1>
        <div className="flex gap-6 items-center">
          <NavLink
            to="/wmhome"
            className={({ isActive }) =>
              `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
            }
          >
            Back to Home
          </NavLink>
        </div>
      </nav>

      <div className="px-10 mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="ALL">All</option>
          <option value="IN_WAREHOUSE">IN_WAREHOUSE</option>
          <option value="LOADED">LOADED</option>
          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="NOT_RECEIVED">NOT_RECEIVED</option>
        </select>
      </div>

      {filteredPackages.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No packages found</p>
      ) : (
        <div className="overflow-x-auto px-10 mt-4">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Package ID</th>
                <th className="px-4 py-2 text-left text-gray-700">Product</th>
                <th className="px-4 py-2 text-left text-gray-700">Quantity</th>
                <th className="px-4 py-2 text-left text-gray-700">Delivery Address</th>
                <th className="px-4 py-2 text-left text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((pkg) => {
                const order = ordersMap[pkg.packageId];
                const canUpdate =
                  ['IN_WAREHOUSE', 'LOADED', 'OUT_FOR_DELIVERY', 'NOT_RECEIVED'].includes(pkg.status);
                return (
                  <tr
                    key={pkg.packageId}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{pkg.packageId}</td>
                    <td className="px-4 py-3">{order?.item?.name || '-'}</td>
                    <td className="px-4 py-3">{order?.quantity || '-'}</td>
                    <td className="px-4 py-3">{order?.address || '-'}</td>
                    <td className="px-4 py-3">{pkg.status}</td>
                    <td className="px-4 py-3">
                      {canUpdate && (
                        <select
                          value={pkg.status}
                          onChange={(e) =>
                            updatePackageStatus(pkg.packageId, e.target.value)
                          }
                          className="px-2 py-1 rounded-md border border-gray-300"
                        >
                          <option value="IN_WAREHOUSE">IN_WAREHOUSE</option>
                          <option value="LOADED">LOADED</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}