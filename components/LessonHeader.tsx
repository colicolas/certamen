// components/LessonHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import LessonStatusBox from "@/components/LessonStatusBox";

interface HeaderProps {
  division: string;
  category: string;
}

// Fetch message from the API
const fetchMessage = async (division: string, category: string) => {
  const res = await axios.get(`/api/lessons/${division}/${category}/msg`);
  return res.data.content;
};

// Fetch lessons data from the API
const fetchLessonsData = async () => {
  const session = await axios.get('/api/auth/session');
  if (session && session.data.user) {
    const res = await axios.get(`/api/user/${session.data.user.id}`);
    return res.data.lessons || [];
  }
  return [];
};

const Header: React.FC<HeaderProps> = ({ division, category }) => {
  const queryClient = useQueryClient();

  const messageCache = queryClient.getQueryData(['lessonMessage', division, category]);
  const lessonsCache = queryClient.getQueryData('userLessons');
  
  const { data: message, isLoading: messageLoading } = useQuery({
    queryKey: ['lessonMessage', division, category],
    queryFn: () => fetchMessage(division, category),
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
    initialData: messageCache,  // Use cached message if available
    onSuccess: (data) => {
      console.log('Message fetched successfully:', data);
    },
    onSettled: (data, error) => {
      if (error) {
        console.error('Error fetching message:', error);
      } else {
        console.log('Message query settled:', data);
      }
    }
  });

  // Query for the lessons, using the cache if available
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['userLessons'],
    queryFn: fetchLessonsData,
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
    initialData: lessonsCache,  // Use cached lessons if available
    onSuccess: (data) => {
      console.log('Lessons fetched successfully:', data);
    },
    onSettled: (data, error) => {
      if (error) {
        console.error('Error fetching lessons:', error);
      } else {
        console.log('Lessons query settled:', data);
      }
    }
  });

  if (messageLoading || lessonsLoading) return <div>Loading...</div>;

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
/*'use client';

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

export default Header;*/
