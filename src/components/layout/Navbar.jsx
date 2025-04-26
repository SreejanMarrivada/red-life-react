
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X, Droplet, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items based on user role
  let menuItems = [];

  if (currentUser) {
    if (currentUser.role === 'donor') {
      menuItems = [
        { name: 'Dashboard', path: '/donor' },
        { name: 'Donation Camps', path: '/donor/camps' },
        { name: 'Appointments', path: '/donor/appointments' },
        { name: 'Donation History', path: '/donor/history' },
        { name: 'Profile', path: '/donor/profile' },
      ];
    } else if (currentUser.role === 'receiver') {
      menuItems = [
        { name: 'Dashboard', path: '/receiver' },
        { name: 'Blood Search', path: '/receiver/search' },
        { name: 'Request History', path: '/receiver/history' },
        { name: 'Profile', path: '/receiver/profile' },
      ];
    } else if (currentUser.role === 'admin') {
      menuItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Donors', path: '/admin/donors' },
        { name: 'Receivers', path: '/admin/receivers' },
        { name: 'Inventory', path: '/admin/inventory' },
        { name: 'Requests', path: '/admin/requests' },
        { name: 'Donation Camps', path: '/admin/camps' },
      ];
    }
  } else {
    menuItems = [
      { name: 'Home', path: '/' },
      { name: 'Login', path: '/login' },
      { name: 'Register', path: '/register' },
    ];
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Droplet className="h-8 w-8 text-blood" />
              <span className="text-xl font-bold text-medical-dark ml-2">BloodBank</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blood text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser && (
              <div className="flex items-center">
                <div className="mr-3 text-sm font-medium text-gray-700">
                  <span className="mr-2">{currentUser.name}</span>
                  {currentUser.role === 'donor' && (
                    <span className="bg-blood-light text-blood-dark text-xs px-2 py-1 rounded-full">
                      {currentUser.bloodType}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-blood text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-blood text-base font-medium text-gray-500"
              >
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </button>
            )}
          </div>
          {currentUser && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 rounded-full bg-gray-100 p-2" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{currentUser.name}</div>
                  <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
