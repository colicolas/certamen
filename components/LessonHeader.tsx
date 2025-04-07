// components/LessonHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import LessonStatusBox from "@/components/LessonStatusBox";

interface HeaderProps {
  category: string;
}

// Fetch message from the API
const fetchMessage = async (category: string): Promise<string> => {
  const res = await axios.get(`/api/lessons/${category}/msg`);
  return res.data.content;
};

// Fetch lessons data from the API
const fetchLessonsData = async (): Promise<string[]> => {
  const session = await axios.get('/api/auth/session');
  if (session?.data?.user) {
    const res = await axios.get(`/api/user/${session.data.user.id}`);
    return res.data.lessons || [];
  }
  return [];
};

const Header: React.FC<HeaderProps> = ({ category }) => {
  const queryClient = useQueryClient();

  const messageCache = queryClient.getQueryData<string>(['lessonMessage', category]);
  const lessonsCache = queryClient.getQueryData<string[]>(['userLessons']);

  const { data: message='', isLoading: messageLoading } = useQuery({
    queryKey: ['lessonMessage', category],
    queryFn: () => fetchMessage(category),
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
    initialData: messageCache,  // Use cached message if available
  });

  // Query for the lessons, using the cache if available
  const { data: lessons=[], isLoading: lessonsLoading } = useQuery({
    queryKey: ['userLessons'],
    queryFn: fetchLessonsData,
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
    initialData: lessonsCache,  // Use cached lessons if available
  });

  if (messageLoading || lessonsLoading) return <div>Loading...</div>;

  return (
    <div className="text-center py-32 bg-black text-white">
      <h1 className="text-4xl font-bold text-white">
        <span className="text-violet-300">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </h1>
      <br />
      <p className="text-xl font-light text-stone-200">{message}</p>
      <div className="flex justify-center mt-8">
        <LessonStatusBox key={category} specialty={category} lessons={lessons} />
      </div>
    </div>
  );
};

export default Header;
