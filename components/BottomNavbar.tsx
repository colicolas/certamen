import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCoins } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';


interface User {
  xp: number;
  level: number;
  coins: number;
  profilePic: string;
}

interface BottomNavbarProps {
  user: User;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ user }) => {
  const totalXP = 100; // Assume 100 XP to the next level
  const progressPercentage = (user.xp / totalXP) * 100;

  return (
    <nav className="fixed bottom-0 w-full text-gray-800 bg-beige-300 p-2 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-2">
        <span>LV. {user.level}:</span>
        <div className="relative w-60 h-6 bg-beige-400 rounded-lg border border-gray-400">
          <div
            className="absolute top-0 h-full bg-beige-700 rounded-lg"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="relative text-center text-medium">
            {user.xp}/{totalXP} XP
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCoins} className="mr-1" />
          {user.coins}
        </div>
        <Link href="/settings" passHref>
          <FontAwesomeIcon icon={faCog} />
        </Link>
        <Image width={40} height={40} src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
      </div>
    </nav>
  );
};

export default BottomNavbar;
