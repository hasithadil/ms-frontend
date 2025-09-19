import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useNavigate, useParams,NavLink } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import '../css/client/Home.css';
import Navbar from "../components/client/Navbar";

let stompClient = null;

export default function ClientPortal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [updates, setUpdates] = useState([]);


  const statusSteps = [
    { key: "NOT_RECEIVED", label: "Order Placed", description: "Your order has been received" },
    { key: "IN_WAREHOUSE", label: "In Warehouse", description: "Package is being processed" },
    { key: "LOADED", label: "Loaded for Delivery", description: "Package is loaded on delivery vehicle" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", description: "Package is on the way" },
    { key: "DELIVERED", label: "Delivered", description: "Package has been delivered" }
  ];

  const getCurrentStepIndex = (status) => statusSteps.findIndex(step => step.key === status);

  const getStatusIcon = (status) => {
    switch (status) {
      case "NOT_RECEIVED":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "IN_WAREHOUSE":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "LOADED":
      case "OUT_FOR_DELIVERY":
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NOT_RECEIVED":
        return "bg-yellow-100 text-yellow-600";
      case "IN_WAREHOUSE":
        return "bg-blue-100 text-blue-600";
      case "LOADED":
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-100 text-indigo-600";
      case "DELIVERED":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // JWT check
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) navigate("/");
  }, [navigate]);

  // Fetch package
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!id || !token) return;

    fetch(`http://localhost:8085/wms/v1/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setPackageDetails(data.deliveryPackageDTO);
        setUpdates([]);
              fetch(`http://localhost:8085/cms/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setOrderDetails(data);
        setUpdates([]);
      })
      .catch(err => console.error("Fetch error:", err));
      })
      .catch(err => console.error("Fetch error:", err));



  }, [id]);

  // WebSocket updates
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!id || !token) return;

    const socket = new SockJS("http://localhost:8084/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket connected");
      stompClient.subscribe("/topic/package-updates", (msg) => {
        if (msg.body) {
          const updatedPkg = JSON.parse(msg.body);
          if (updatedPkg.packageId === String(id)) {
            setPackageDetails(updatedPkg);
            setUpdates(prev => [...prev, updatedPkg]);
          }
        }
      });
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => console.log("STOMP disconnected"));
      }
    };
  }, [id]);

  if (!packageDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No package found for ID: {id}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex(packageDetails.status);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
    
      <div className="w-full max-w-3xl space-y-6">


        {/* Package Card */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start ">
            <div>
              <h2 className="text-xl font-bold">Package #{packageDetails.packageId}</h2>
    

            </div>
            
            <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(packageDetails.status)} font-medium`}>
              {getStatusIcon(packageDetails.status)}
              <span className="ml-2">{packageDetails.status.replace("_", " ")}</span>
            </div>
          </div>
            <div className="text-sm text-gray-500 mb-1 p-4 rounded-lg bg-gray-100 w-full mb-4">
               <p className="text-gray-600  ">
                Item: <span className="font-bold">{orderDetails?.item?.name || "N/A"}</span>
              </p>
              <p className="text-gray-600 ">
                Address: <span className="font-bold">{orderDetails?.address || "N/A"}</span>
              </p>
              <p className="text-gray-600 ">
                Total Price: LKR <span className="font-bold">{orderDetails?.totalPrice || "N/A"}</span>
              </p>
              <p className="text-gray-600 ">
                  Shipping Fee : LKR <span className="font-bold">{orderDetails?.shippingFee || "N/A"}</span>
                </p>
                </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p><strong>Created At:</strong> {formatDateTime(packageDetails.createdAt)}</p>
              <p><strong>Last Updated:</strong> {formatDateTime(packageDetails.updatedAt)}</p>
            </div>
            <div>
              <p><strong>Status Updates:</strong></p>
              {updates.length === 0 ? (
                <p className="text-sm text-gray-500">No updates yet</p>
              ) : (
                <ul className="text-sm text-gray-600 space-y-1">
                  {updates.map((u, idx) => (
                    <li key={idx}>
                      {u.status.replace("_", " ")} at {formatDateTime(u.updatedAt)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Progress Tracker */}
          <div>
            <h3 className="font-semibold mb-3">Delivery Progress</h3>
            <div className="space-y-3">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isActive = index === currentStep;

                return (
                  <div key={step.key} className="flex items-center gap-4">
                    {/* Step circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300'}`}>
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="text-gray-500">{index + 1}</span>}
                    </div>
                    {/* Step text */}
                    <div className="flex-1">
                      <div className={`font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</div>
                      <div className="text-sm text-gray-400">{step.description}</div>
                    </div>
                    {isActive && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full animate-pulse">Current Status</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
                  {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back
        </button>
        </div>
      </div>
    </div>
    </>
  );
}