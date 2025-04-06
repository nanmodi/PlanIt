import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, userName, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl">PlanIt</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/home" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150">Home</Link>
            <Link to="/events" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150">Events</Link>
            <Link to="/flight" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150">Flights</Link>
            <Link to="/hotels" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150">Hotels</Link>
            <Link to="/chat" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150">Chat</Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">{userName}</span>
                <button
                  onClick={handleLogoutClick}
                  className="ml-4 px-4 py-2 rounded-md bg-white text-indigo-600 font-medium hover:bg-gray-100 transition duration-150"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="ml-4 px-4 py-2 rounded-md bg-white text-indigo-600 font-medium hover:bg-gray-100 transition duration-150">
                Login/Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;