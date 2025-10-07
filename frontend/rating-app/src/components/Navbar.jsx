import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Key, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-700 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         
          <div className="flex items-center space-x-6">
            <Link
              to={user ? `/${user.role}` : "/login"}
              className="text-xl font-extrabold text-white tracking-wider hover:text-indigo-300 transition-colors"
            >
              Rating App
            </Link>

           
            
          </div>

         
          <div className="hidden sm:flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <>
                <span className="text-sm text-indigo-300 font-medium flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {user.role}
                </span>
                <Link
                  to="/update-password"
                  className="text-sm text-gray-300 hover:text-white transition-colors p-1 rounded flex items-center"
                >
                  <Key className="w-4 h-4 mr-1" />
                  Password
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 p-2 px-4 text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 sm:mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors p-2 rounded flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-4 rounded-lg bg-indigo-500 font-semibold shadow-md hover:bg-indigo-600 transition-colors flex items-center"
                >
                  <UserPlus className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>

 
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-gray-700 px-4 pt-2 pb-4 space-y-2 border-t border-gray-600">
          {user && (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user.role === "user" && (
                <Link
                  to="/user"
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  User Dashboard
                </Link>
              )}
              {user.role === "owner" && (
                <Link
                  to="/owner"
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Store Owner
                </Link>
              )}
              <span className="block text-sm text-indigo-300 font-medium flex items-center mt-2">
                <User className="w-4 h-4 mr-1" />
                {user.role}
              </span>
              <Link
                to="/update-password"
                className="block text-gray-300 hover:text-white transition-colors flex items-center mt-1"
                onClick={() => setMenuOpen(false)}
              >
                <Key className="w-4 h-4 mr-1" />
                Password
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 p-2 px-4 text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center mt-1 justify-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link
                to="/login"
                className="block text-gray-300 hover:text-white transition-colors flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
              <Link
                to="/signup"
                className="block py-2 px-4 rounded-lg bg-indigo-500 font-semibold shadow-md hover:bg-indigo-600 transition-colors flex items-center mt-1"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
