import React, { useState } from "react";
import { Menu, X, BookOpen, UserPlus, LogIn, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NavbarV2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (section) => {
    console.log(`Navigating to: ${section}`);
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#0f172a] to-blue-700 bg-clip-text text-transparent">
            Vigour
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-20 space-x-8">
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center cursor-pointer space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </button>

            <button
              onClick={() => navigate("/auth/register/creator")}
              className="flex items-center cursor-pointer space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <Crown className="w-4 h-4" />
              <span>Register as Creator</span>
            </button>
          </div>
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/auth/register/user")}
              className="flex items-center cursor-pointer space-x-1 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>

            <button
              onClick={() => navigate("/auth/login")}
              className="flex items-center cursor-pointer space-x-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="pt-4 space-y-3">
            {/* Mobile Navigation Links */}
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              <BookOpen className="w-5 h-5" />
              <span>Courses</span>
            </button>

            <button
              onClick={() => navigate("/auth/register/creator")}
              className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              <Crown className="w-5 h-5" />
              <span>Register as Creator</span>
            </button>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 space-y-3 border-t border-blue-100">
              <button
                onClick={() => navigate("/auth/register/user")}
                className="flex items-center space-x-2 w-full text-left px-4 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
              </button>

              <button
                onClick={() => navigate("/auth/login")}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarV2;
