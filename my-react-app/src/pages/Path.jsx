import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Circle ,Locate } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate, NavLink } from "react-router-dom";

export default function Path({ routeId }) {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    axios
      .get(
        "http://localhost:8085/cms/orders/getDeliveryAddresses",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const stopsArr = res.data.routeDetails
          .split("|")
          .map((s) => s.trim())
          .map((item) => {
            const [id, address] = item.split("->").map((i) => i.trim());
            return { orderId: id, address, delivered: false };
          });
        setStops(stopsArr);
      })
      .catch((err) => toast.error("Failed to fetch route"))
      .finally(() => setLoading(false));
  }, [routeId]);

  const markDelivered = (index) => {
    const stop = stops[index];
    const token = localStorage.getItem("jwtToken");

    axios
      .post(
        "http://localhost:8085/wms/v1/updatePackageState",
        {
          orderid: stop.orderId,
          state: "DELIVERED",
          remarks: "Delivered",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(`Order ${stop.orderId} marked delivered`);
        setStops((prev) =>
          prev.map((s, i) =>
            i === index ? { ...s, delivered: true } : s
          )
        );
      })
      .catch(() => toast.error("Failed to update"));
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading route...</p>
        </div>
      </div>
    );
  }

  const currentStopIndex = stops.findIndex((stop) => !stop.delivered);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
            <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SwiftTrack</h1>
        <div className="flex gap-6 items-center">
          <NavLink
            to="/dphome"
            className={({ isActive }) =>
              `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
            }
          >
            Back to Home
          </NavLink>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="relative flex flex-col items-center">
          <div className="absolute top-16 bottom-12 left-6 w-1 bg-gradient-to-b from-blue-600 to-transparent bg-[length:100%_20px]"></div>

          {stops.map((stop, index) => {
            const isCurrent = index === currentStopIndex;
            return (
              <div
                key={stop.orderId}
                className="flex items-start mb-12 relative w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`rounded-full border-4 ${
                      stop.delivered
                        ? "border-green-500 bg-green-100"
                        : "border-blue-600 bg-blue-100"
                    } flex items-center justify-center h-12 w-12 ${
                      isCurrent ? "animate-[pulse_1.5s_ease-in-out_infinite]" : ""
                    } shadow-md`}
                  >
                    {stop.delivered ? (
                      <CheckCircle className="text-green-600 h-6 w-6" />
                    ) : (
                      <Circle className="text-blue-600 h-6 w-6" />
                    )}
                  </div>
                </div>

                <div className="ml-8 bg-white shadow-xl rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center w-full border-l-4 border-blue-600">
                  <div className="mb-4 md:mb-0 w-500">
                    <p className="font-semibold text-lg text-gray-800 mb-2">
                      Order ID #{stop.orderId}
                    </p>
                    <p className="text-gray-600">{stop.address}</p>
                  </div>
                  {!stop.delivered && (
                    <button
                      onClick={() => markDelivered(index)}
                      className="mt-4 md:mt-0 px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}