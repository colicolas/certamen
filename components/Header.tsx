// components/Header.tsx
'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <div className="text-center py-32 bg-black text-white">
      <h1 className="text-4xl font-bold text-white">Welcome back, <span className="text-indigo-300">{username}</span></h1>
      <br></br>
      <p className="text-xl font-light">study so you <span className="font-bold text-fuchsia-400">don't let down your team :)</span></p>
    </div>

    // other option - light header
    /*<div className="text-center py-32 bg-beige-200">
      <h1 className="text-4xl font-bold text-gray-800">Welcome back, <span className="text-indigo-600">{username}</span></h1>
      <br></br>
      <p className="text-xl font-light">study so you <span className="font-bold text-fuchsia-400">don't let down your team :)</span></p>
    </div>*/
  );
};

export default Header;
