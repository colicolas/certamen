// app/study/[division]/[category]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import LessonHeader from '@/components/LessonHeader';
import LessonLink from '@/components/LessonLink';

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
      <br />
      <br />
      <div className="p-8">
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300"></div>
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(index + 1);
            const isLeft = index % 2 === 0;
            return (
              <div key={index} className={`mb-8 flex justify-center items-center w-full`}>
                <div className={`w-1/2 flex flex-col items-${isLeft ? 'end' : 'start'} pr-${isLeft ? 8 : 0} pl-${isLeft ? 0 : 8}`}>
                  <LessonLink
                    division={division}
                    category={category}
                    lessonNumber={index + 1}
                    title={lesson.title}
                    frequency={lesson.frequency}
                    description={lesson.description}
                    status={status}
                    isLeft={isLeft}
                  />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className={`block w-2 h-2 rounded-full ${status === 'complete' ? 'bg-indigo-300' : status === 'progress' ? 'bg-blue-500' : 'bg-gray-800'}`}></span>
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
