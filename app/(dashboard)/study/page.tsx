// pages/study.tsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StudyBox from '@/components/StudyBox';
import Header from '@/components/Header';
import Link from 'next/link';

type Specialty = 'myth' | 'history' | 'literature' | 'pmaq' | 'vocab' | 'grammar' | 'culture';

const StudyPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [division, setDivision] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [lessons, setLessons] = useState<string[]>([]);
  const totalLessons: { [key in Specialty]: number } = {
    myth: 10,
    history: 8,
    literature: 12,
    pmaq: 6,
    vocab: 7,
    grammar: 5,
    culture: 9,
  };
  
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
          setLessons(userData.lessons || []);
          /*setUsername(session.data.user.username);
          setDivision(session.data.user.division);
          setSpecialties(session.data.user.specialties);
          setLessons(session.data.user.lessons);*/
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
        {(!division && specialties.length === 0) && (
          <div className="ml-20 mt-10">
            <p>You currently don't have any specialties or division set. Go to <Link href="/settings" className="text-indigo-600 underline transition duration-300 hover:text-indigo-400">settings</Link> to do that.</p>
          </div>
        )}
        {!division && specialties.length > 0 && (
          <div className="ml-20 mt-10">
            <p>You currently don't have a division set. Go to <Link href="/settings" className="text-indigo-600 underline transition duration-300 hover:text-indigo-400">settings</Link> to do that.</p>
          </div>
        )}
        {division && specialties.length === 0 && (
          <div className="ml-20 mt-10">
            <p>You currently don't have any specialties set. Go to <Link href="/settings" className="text-indigo-600 underline transition duration-300 hover:text-indigo-400">settings</Link> to do that.</p>
          </div>
        )}
        {division && specialties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10 ml-20">
            {specialties.map((specialty) => (
              <StudyBox key={specialty} division={division} specialty={specialty} lessons={lessons} totalLessons={totalLessons[specialty as Specialty]}/>
            ))}
          </div>
        )}
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
