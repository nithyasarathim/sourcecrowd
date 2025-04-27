import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path === '/dashboard' && location.pathname === '/');

  return (
    <div className="bg-black flex items-center justify-between px-8 h-20 w-full">
      <img src={Logo} alt="Logo" className="w-50 h-fit" />
      <div className="text-green-50 flex items-center space-x-8">
        
        <Link to="/dashboard">
          <h1 className={`${isActive('/dashboard') ? 'text-green-500 border-green-500 border-b-2' : 'hover:text-green-300'}`}>
            Dashboard
          </h1>
        </Link>
        
        <Link to="/campaigns">
          <h1 className={`${isActive('/campaigns') ? 'text-green-500 border-green-500 border-b-2' : 'hover:text-green-300'}`}>
            Campaigns
          </h1>
        </Link>

        <Link to="/profile">
          <div className={`flex items-center space-x-2 rounded-lg px-4 py-1 ${isActive('/profile') ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}>
            <h1>Profile</h1>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Header;
