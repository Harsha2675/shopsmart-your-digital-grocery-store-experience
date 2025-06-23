import React from "react";
import { Link, Outlet } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import {
  FaUsers,
  FaBoxOpen,
  FaPlusSquare,
  FaShoppingCart,
  FaComments,
  FaStar,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const AdminPanel = () => {
  const userData = useSelector((state) => state.user);

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex hidden">
      {/* Sidebar */}
      <aside className="bg-white min-h-full w-full max-w-60 shadow-lg">
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {userData.image ? (
              <img
                src={userData.image}
                alt="user"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <HiOutlineUserCircle className="text-gray-400 w-20 h-20" />
            )}
          </div>
          <p className="capitalize text-lg font-semibold mt-2">Admin</p>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        {/* Navigation Links */}
        <nav className="grid p-4 font-bold capitalize space-y-3">
          <Link
            to="/allusers"
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            <FaUsers className="mr-2" /> All Users
          </Link>

          <Link
            to="/listofproducts"
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            <FaBoxOpen className="mr-2" /> All Products
          </Link>

          <Link
            to="/newproduct"
            className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            <FaPlusSquare className="mr-2" /> New Product
          </Link>

          <Link
            to="/orders"
            className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            <FaShoppingCart className="mr-2" /> Orders
          </Link>

          <Link
            to="/addresses"
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            <FaUsers className="mr-2" /> Customer Addresses
          </Link>

          <Link
            to="/allcontacts"
            className="flex items-center px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            <FaComments className="mr-2" /> Complaints
          </Link>

          <Link
            to="/feedback"
            className="flex items-center px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            <FaStar className="mr-2" /> Feedbacks
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
