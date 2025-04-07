// components/Header.tsx
'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <div className="text-center py-32 bg-violet-300 text-white">
      <p className="text-lg font-light text-violet-600">Nationals is in less than 4 months!</p>
      <h1 className="text-4xl font-bold text-gray-800">Welcome back, <span className="text-violet-500">{username}</span></h1>
      <br></br>
    </div>
  );
};

export default Header;
