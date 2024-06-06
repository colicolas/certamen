import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FormButton from '@/components/FormButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';

const SideNavbar: React.FC = () => {
  const pathname = usePathname();
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  const handleLogout = () => {
    // Perform logout logic, such as calling NextAuth's signOut function
    console.log("User logged out");
    signOut({ callbackUrl: '/' });
    setShowLogoutPrompt(false); // Close the prompt after logging out
  };

  return (
    <div className="fixed h-full w-1/5 bg-beige-300 p-4 shadow-md">
      <nav>
        <ul>
          <li className="p-2">
            <Link href="/study" className="flex items-center">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
            </Link>
          </li>
          <li className={`${pathname === '/settings' ? 'bg-beige-400' : ''} p-2`}>
            <Link href="/settings">Profile</Link>
          </li>
          <li
            className="p-2 text-indigo-600 cursor-pointer transition duration:300 hover:bg-beige-400"
            onClick={() => setShowLogoutPrompt(true)}
          >
            Log Out
          </li>
        </ul>
      </nav>
      {showLogoutPrompt && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-beige-300 p-6 rounded-lg text-center">
            <h2 className="text-xl mb-4">Are you sure you want to Log Out?</h2>
            <div className="flex justify-center space-x-4">
              <FormButton text="Yes" link="#" style="border-indigo-600 bg-beige-300 text-gray-800 hover:bg-beige-500" onClick={handleLogout} />
              <FormButton text="No" link="#" style="bg-indigo-600 text-white hover:bg-indigo-400" onClick={() => setShowLogoutPrompt(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNavbar;
