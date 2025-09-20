import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = { 
      name, 
      price: parseFloat(price), 
      sku, 
      stock: parseInt(stock), 
      image 
    };

    // Send `itemData` to backend
    axios.post("http://localhost:8085/wms/items/add", itemData)
      .then((response) => {
        toast.success("Item added successfully!");
        // Reset form or redirect
        setName("");
        setPrice("");
        setSku("");
        setStock("");
        setImage("");
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        toast.error("Failed to add item");
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">
          Add New Item
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter item name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="0.00"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter SKU"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter stock quantity"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Add Item
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Want to view items?{" "}
          <a href="/items" className="font-medium text-blue-600 hover:underline">
            View all items
          </a>
        </p>
      </div>
    </div>
  );
}