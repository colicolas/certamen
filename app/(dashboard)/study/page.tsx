// pages/study.tsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StudyBox from '@/components/StudyBox';
import Header from '@/components/Header';

const StudyPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [division, setDivision] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await axios.get('/api/auth/session'); // Assuming you have an endpoint to get session data
        if (session && session.data.user)
        {
          const res = await axios.get(`/api/user/${session.data.user.id}`);
          const userData = res.data;

          setUsername(userData.username);
          setDivision(userData.division);
          setSpecialties(userData.specialties);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen">
      <Header username={username} />
      <div className="p-4">
        <h2 className="text-3xl mt-20 ml-20 font-bold">Study</h2>
        <div className="flex mt-10 ml-20">
          {specialties.map((specialty) => (
            <StudyBox key={specialty} division={division} specialty={specialty} />
          ))}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-3xl mt-20 ml-20 font-bold">Practice</h2>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default StudyPage;
