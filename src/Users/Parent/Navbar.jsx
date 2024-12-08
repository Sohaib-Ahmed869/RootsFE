import React, { useState } from "react";
import { LogOut } from "lucide-react";
import logo from "../../assets/logo.png";

// Navbar Component
const Navbar = ({ onLogout }) => (
  <nav className="bg-white shadow-md w-full">
    <div className="mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          {/* School Logo */}

          <img src={logo} alt="School Logo" className="h-8" />
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
