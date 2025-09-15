import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Award } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Award className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CertifyMe</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-6">
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/quizzes"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Quizzes
                </Link>
                <Link
                  to="/history"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  History
                </Link>
              </nav>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;