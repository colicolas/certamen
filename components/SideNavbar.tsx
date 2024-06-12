import React, { useState } from 'react';
import Link from 'next/link';
import FormButton from '@/components/FormButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import ConfirmationPopup from '@/components/ConfirmationPopup';

type SideNavbarProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const SideNavbar: React.FC<SideNavbarProps> = ({ selectedTab, setSelectedTab }) => {
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
    signOut({ callbackUrl: '/' });
    setShowLogoutPrompt(false);
  };

  return (
    <div className="fixed h-full w-1/5 bg-beige-300 p-4 shadow-md">
      <nav>
        <ul>
          <li className="p-2 hover:underline transition duration-300">
            <Link href="/study" className="flex items-center">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </Link>
          </li>
          <li
            className={`my-1 transition duration-300 hover:bg-beige-400 hover:cursor-pointer rounded-md ${
              selectedTab === 'profile' ? 'bg-beige-600' : ''
            } p-2`}
            onClick={() => setSelectedTab('profile')}
          >
            Profile
          </li>
          <li
            className={`my-1 transition duration-300 hover:bg-beige-400 hover:cursor-pointer rounded-md ${
              selectedTab === 'account-info' ? 'bg-beige-600' : ''
            } p-2`}
            onClick={() => setSelectedTab('account-info')}
          >
            Account Information
          </li>
          <li
            className="p-2 rounded-md text-indigo-600 cursor-pointer transition duration-300 hover:bg-beige-400"
            onClick={() => setShowLogoutPrompt(true)}
          >
            Log Out
          </li>
        </ul>
      </nav>
      {showLogoutPrompt && (
        <ConfirmationPopup
          title="Are you sure you want to Log Out?"
          message=""
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutPrompt(false)}
        />
      )}
    </div>
  );
};

export default SideNavbar;
