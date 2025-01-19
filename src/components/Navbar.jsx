import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-gray-800/95 backdrop-blur-sm shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-xl font-bold text-white hover:text-blue-400 transition duration-300"
          >
            PotholePatrol
          </Link>
          
          <div className="space-x-1 md:space-x-4">
            <Link 
              to="/" 
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500/10 transition duration-300"
            >
              Home
            </Link>
            
            {currentUser && (
              <>
                <Link 
                  to="/report" 
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500/10 transition duration-300"
                >
                  Report Pothole
                </Link>
                <Link 
                  to="/map" 
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500/10 transition duration-300"
                >
                  View Map
                </Link>
                <Link 
                  to="/rewards" 
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500/10 transition duration-300"
                >
                  Rewards
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-500/10 transition duration-300"
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
              </>
            )}
            
            {!currentUser && (
              <Link 
                to="/login" 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 