// app/study/[division]/[category]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import LessonHeader from '@/components/LessonHeader';

interface LessonData {
  title: string;
  description: string;
  date: string;
  author: string;
  frequency: string;
}

const StudyCategoryPage: React.FC = () => {
  const { division, category } = useParams();
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [userLessons, setUserLessons] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await axios.get('/api/auth/session');
        if (session && session.data.user) {
          const res = await axios.get(`/api/user/${session.data.user.id}`);
          const userData = res.data;
          setUserLessons(userData.lessons || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchLessonsData = async () => {
      try {
        const res = await axios.get(`/api/lessons/${division}/${category}`);
        const { totalLessons } = res.data;

        const lessonsData = await Promise.all(
          Array.from({ length: totalLessons }, (_, i) => i + 1).map(async (num) => {
            const lessonRes = await axios.get(`/api/lessons/${division}/${category}/${num}`);
            return lessonRes.data;
          })
        );

        setLessons(lessonsData);
      } catch (error) {
        console.error('Error fetching lessons data:', error);
      }
    };

    fetchUserData();
    fetchLessonsData();
  }, [division, category]);

  const getLessonStatus = (lessonNumber: number) => {
    const lessonPath = `${division}/${category}/${lessonNumber}`;
    if (userLessons.includes(`${lessonPath}-complete`)) return 'complete';
    if (userLessons.includes(`${lessonPath}-progress`)) return 'progress';
    return 'unstarted';
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <LessonHeader division={division} category={category} />
      <div className="p-8">
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300"></div>
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(index + 1);
            const isLeft = index % 2 === 0;
            return (
              <div key={index} className={`mb-8 flex justify-${isLeft ? 'start' : 'end'} items-center w-full`}>
                <div className="w-1/2 flex flex-col items-center">
                  <div className={`relative flex items-center justify-center rounded-full w-10 h-10 ${status === 'complete' ? 'bg-indigo-300' : status === 'progress' ? 'bg-blue-500' : 'bg-gray-800'} cursor-pointer`} title={lesson.title}>
                    {status !== 'unstarted' && <span className={`absolute inset-0 rounded-full ${status === 'complete' ? 'bg-indigo-300' : 'bg-blue-500'}`}></span>}
                    <Link href={`/study/${division}/${category}/${index + 1}`} className="text-white">{index + 1}</Link>
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    <p className="text-sm">{lesson.frequency}</p>
                    <p className="text-sm">{lesson.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyCategoryPage;
