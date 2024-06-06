'use client';
import React, { useState } from 'react';
import SideNavbar from '@/components/SideNavbar';
import Input from '@/components/FormTextInput';
import FormButton from '@/components/FormButton';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    // Save the username and bio
    console.log("Username saved:", username);
    console.log("Bio saved:", bio);
  };

  return (
    <div className="flex min-h-screen">
      <SideNavbar />
      <div className="flex-1 p-10 bg-beige-200 ml-[20%]"> {/* Adjusted to account for navbar width */}
        <h1 className="text-3xl mb-6">Profile</h1>
        <div className="flex">
          <div className="flex-1 max-w-lg">
            <Input
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <FormButton
              text="Save"
              onClick={handleSave}
              style="bg-indigo-600 text-white w-full"
            />
          </div>
          <div className="w-1/4 ml-10">
            <Image
              src="/path/to/profile-pic.jpg" // Replace with the real profile picture path
              alt="Profile Picture"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
/*'use client';
import React, { useState } from 'react';
import SideNavbar from '@/components/SideNavbar';
import Input from '@/components/FormTextInput';
import FormButton from '@/components/FormButton';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    // Save the username and bio
  };

  return (
    <div className="flex min-h-screen bg-beige-200">
      <SideNavbar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl mb-6">Profile</h1>
        <div className="flex">
          <div className="flex-1">
            <Input
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <FormButton
              text="Save"
              onClick={handleSave}
              style="bg-indigo-600 text-white"
            />
          </div>
          <div className="w-1/4 ml-10">
            <Image
              src="/path/to/profile-pic.jpg" // Replace with the real profile picture path
              alt="Profile Picture"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;*/
