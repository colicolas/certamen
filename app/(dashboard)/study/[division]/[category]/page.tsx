// app/study/[division]/[category]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import axios from 'axios';
import LessonHeader from '@/components/LessonHeader';
import LessonLink from '@/components/LessonLink';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {useEffect} from 'react';

interface LessonData {
  title: string;
  description: string;
  date: string;
  author: string;
  frequency: string;
}

const fetchUserData = async () => {
  const session = await axios.get('/api/auth/session');
  if (session && session.data.user) {
    const res = await axios.get(`/api/user/${session.data.user.id}`);
    return res.data.lessons || [];
  }
  return [];
};

const fetchLessonsData = async (division: string, category: string) => {
  const res = await axios.get(`/api/lessons/${division}/${category}`);
  console.log("using trad fetch method");
  const { totalLessons } = res.data;

  const lessonsData = await Promise.all(
    Array.from({ length: totalLessons }, (_, i) => i + 1).map(async (num) => {
      const lessonRes = await axios.get(`/api/lessons/${division}/${category}/${num}`);
      return lessonRes.data;
    })
  );

  return lessonsData;
};

const StudyCategoryPage: React.FC = () => {
  const { division, category } = useParams();
  const queryClient = useQueryClient();
  const divisionParam = Array.isArray(division) ? division[0] : division;
  const categoryParam = Array.isArray(category) ? category[0] : category;

  const lessonsCache = queryClient.getQueryData(['lessonsData', divisionParam, categoryParam]);
  const userLessonsCache = queryClient.getQueryData(['userLessons']);

  const { data: userLessons, isLoading: userLoading } = useQuery({
    queryKey: ['userLessons'],
    queryFn: fetchUserData,
    staleTime: 5 * 60 * 1000,  // Cache stays fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Cache is kept for 10 minutes after last use
    initialData: userLessonsCache as string[],  // Use cached data if available
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessonsData', divisionParam, categoryParam],
    queryFn: () => fetchLessonsData(divisionParam as string, categoryParam as string),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: !!divisionParam && !!categoryParam,
    initialData: lessonsCache,
  });
  
  console.log('userLessons:', userLessons);
  console.log('userLoading:', userLoading);
  console.log('lessons:', lessons);
  console.log('lessonsLoading:', lessonsLoading);

  if (userLoading || lessonsLoading || !lessons) return <div>Loading...</div>;

  const getLessonStatus = (lessonNumber: number) => {
    const lessonPath = `${division}/${category}/${lessonNumber}`;
    if (userLessons?.includes(`${lessonPath}-complete`)) return 'complete';
    if (userLessons?.includes(`${lessonPath}-progress`)) return 'progress';
    return 'unstarted';
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <LessonHeader division={divisionParam} category={categoryParam} />
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
                    division={divisionParam}
                    category={categoryParam}
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
/*'use client';

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
  let { division, category } = useParams();
  division = Array.isArray(division) ? division[0] : division;
  category = Array.isArray(category) ? category[0] : category;

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

export default StudyCategoryPage;*/
