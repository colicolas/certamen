// components/LessonHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import LessonStatusBox from "@/components/LessonStatusBox";

interface HeaderProps {
  division: string;
  category: string;
}

const Header: React.FC<HeaderProps> = ({ division, category }) => {
  const [message, setMessage] = useState<string>('');
  const [lessons, setLessons] = useState<string[]>([]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get(`/api/lessons/${division}/${category}/msg`);
        setMessage(res.data.content);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    const fetchLessonsData = async () => {
      try {
        const session = await axios.get('/api/auth/session'); // Assuming you have an endpoint to get session data
        if (session && session.data.user) {
          const res = await axios.get(`/api/user/${session.data.user.id}`);
          setLessons(res.data.lessons);
        }
      } catch (error) {
          console.error('Error fetching lessons data:', error);
      }
    };

    fetchMessage();
    fetchLessonsData();
  }, [division, category]);
  return (
    <div className="text-center py-32 bg-black text-white">
      <h1 className="text-4xl font-bold text-white">
        {`${division.toUpperCase()}: `}
        <span className="text-violet-300">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </h1>
      <br />
      <p className="text-xl font-light text-stone-200">{message}</p>
      <div className="flex justify-center mt-8">
        <LessonStatusBox key={category} division={division} specialty={category} lessons={lessons} />
      </div>
    </div>
  );
};

export default Header;
