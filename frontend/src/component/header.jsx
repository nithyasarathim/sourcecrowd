import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path === '/dashboard' && location.pathname === '/');

  return (
    <div className="bg-black flex items-center justify-between px-8 h-20 w-full">
      <img src={Logo} alt="Logo" className="w-[300px] h-fit" />
      <div className="text-[#c1ff72] flex items-center space-x-8">
        
        <Link to="/dashboard">
          <h1 className={`${isActive('/dashboard') ? 'text-[#c1ff72] border-[#c1ff72] border-b-2' : 'hover:text-[#c1ff72]'}`}>
            Dashboard
          </h1>
        </Link>
        
        <Link to="/campaigns">
          <h1 className={`${isActive('/campaigns') ? 'text-[#c1ff72] border-[#c1ff72] border-b-2' : 'hover:text-[#c1ff72]'}`}>
            Campaigns
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default Header;
