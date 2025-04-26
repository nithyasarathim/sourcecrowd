import React from 'react';
import Logo from '../assets/logo.png';

const Header = () => {
  return (
    <div className="bg-black flex items-center justify-between px-8 h-20 w-full ">
      <img src={Logo} alt="Logo" className="w-50 h-fit" />
      <div className="text-green-50 flex text-green-100 items-center space-x-8">
        <h1 className='border-green-10 border-b-3 rounded-xs'>Dashboard</h1>
        <h1>Campaigns</h1>
        <div className="flex items-center space-x-2 bg-green-600 rounded-lg px-4 py-1 ">
          <h1>Profile</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
