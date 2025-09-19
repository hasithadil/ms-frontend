import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold text-blue-600">SwiftTrack</h1>

      {/* Links */}
      <div className="flex space-x-6">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-blue-600 pb-1"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/order"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-blue-600 pb-1"
          }
        >
          Orders
        </NavLink>
      </div>
    </nav>
  );
}