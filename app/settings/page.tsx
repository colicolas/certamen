'use client';
import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import SideNavbar from '@/components/SideNavbar';
import Input from '@/components/FormTextInput';
import axios from 'axios';
import FormButton from '@/components/FormButton';
import Image from 'next/image';
import ConfirmationPopup from '@/components/ConfirmationPopup';

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  useEffect(() => {
    if (session) {
      setUsername(session.user.username || '');
      setBio(session.user.bio || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/user/${session.user.id}`, {
        username,
        bio,
      });
      const updatedUserData = response.data;
      await update({
        ...session,
        user: {
          ...session.user,
          username: updatedUserData.username,
          bio: updatedUserData.bio,
        },
      });

      setShowSavePrompt(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideNavbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-1 p-10 bg-beige-200 ml-[20%]">
        {selectedTab === 'profile' && (
          <>
            <h1 className="text-3xl mb-6">Profile</h1>
          </>
        )}
        {selectedTab === 'account-info' && (
          <>
            <h1 className="text-3xl mb-6">Account Information</h1>
            <div className="flex">
              <div className="flex-1 max-w-lg">
                <Input
                  label="Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="cursor-not-allowed"
                />
                <Input
                  label="Username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                  required
                  className={!isEditing ? 'cursor-not-allowed' : ''}
                />
                <Input
                  label="Bio"
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'cursor-not-allowed' : ''}
                />
                <div className="flex space-x-4">
                  <FormButton
                    text={isEditing ? "Save" : "Change"}
                    onClick={isEditing ? () => setShowSavePrompt(true) : () => setIsEditing(true)}
                    style="bg-indigo-600 text-white w-50% hover:bg-indigo-400"
                  />
                  {isEditing && (
                    <FormButton
                      text="Cancel"
                      onClick={() => setIsEditing(false)}
                      style="bg-gray-600 text-white w-50% hover:bg-gray-400"
                    />
                  )}
                </div>
              </div>
              <div className="w-1/4 ml-10">
                <Image
                  src={"/" + session?.user?.profile + ".jpg" || "/path/to/default-profile-pic.jpg"} // Replace with the actual profile picture path
                  alt="Profile Picture"
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              </div>
            </div>
          </>
        )}
      </div>
      {showSavePrompt && (
        <ConfirmationPopup
          title="Are you sure you want to save changes?"
          message=""
          onConfirm={handleSave}
          onCancel={() => setShowSavePrompt(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;

