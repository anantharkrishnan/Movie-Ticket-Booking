import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const AdminNavbar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full p-4 bg-linear-to-t from-blue-950 via-purple-950 to-pink-950 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative">
      
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <h3 className="text-2xl sm:text-3xl md:text-3xl font-bold font-logo bg-linear-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
          MOVIEQUE
        </h3>
        <h2 className="text-lg sm:text-xl md:text-xl font-bold font-logo bg-linear-to-r from-amber-600 to-yellow-400 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>

      
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      
      <div
        className={`flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto absolute md:static top-full left-0 md:top-auto md:left-auto bg-[#1e1e2e] md:bg-transparent p-4 md:p-0 rounded-b-xl transition-all ${
          isOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <Link
          to="/admin"
          className="text-lg font-logo font-bold bg-linear-to-r from-gray-400 to-white bg-clip-text text-transparent"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/movies"
          className="text-lg font-logo font-bold bg-linear-to-r from-gray-400 to-white bg-clip-text text-transparent"
          onClick={() => setIsOpen(false)}
        >
          Movies
        </Link>
        <Link
          to="/admin/theatres"
          className="text-lg font-logo font-bold bg-linear-to-r from-gray-400 to-white bg-clip-text text-transparent"
          onClick={() => setIsOpen(false)}
        >
          Theatres
        </Link>
        <Link
          to="/admin/shows"
          className="text-lg font-logo font-bold bg-linear-to-r from-gray-400 to-white bg-clip-text text-transparent"
          onClick={() => setIsOpen(false)}
        >
          Shows
        </Link>
        <Link
          to="/admin/comingsoon"
          className="text-lg font-logo font-bold bg-linear-to-r from-gray-400 to-white bg-clip-text text-transparent"
          onClick={() => setIsOpen(false)}
        >
          ComingSoon
        </Link>

        <button
          onClick={handleLogout}
          className="text-lg sm:text-xl font-medium bg-linear-to-r from-amber-600 to-yellow-500 text-white px-3 py-1 rounded mt-2 md:mt-0"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;




