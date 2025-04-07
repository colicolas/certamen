'use client';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
import TableOfContents from '@/components/TableOfContents';
import { useQuery } from '@tanstack/react-query';
import PrevButton from '@/components/PrevButton';
import NextButton from '@/components/NextButton';
import LessonProgressDropdown from '@/components/LessonProgressDropdown';

const DynamicLessonsNavBar = dynamic(() => import('@/components/LessonsNavBar'), { ssr: false });

const fetchLesson = async (category: string, lesson: string) => {
  const res = await axios.get(`/lessons/${category}/${lesson}.md`);
  const parsed = matter(res.data);
  return {
    title: parsed.data.title,
    description: parsed.data.description,
    frequency: parsed.data.frequency,
    author: parsed.data.author,
    content: parsed.content,
  };
};

const fetchLessonStatus = async (userId: string, category: string, lesson: string) => {
  const res = await axios.get(`/api/user/${userId}/progress`, {
    params: { category, lesson }
  });
  return res.data.status || 'unstarted';
};

const StudyLessonPage: React.FC = () => {
  const { category, lesson } = useParams();
  const categoryParam = Array.isArray(category) ? category[0] : category;
  const lessonParam = Array.isArray(lesson) ? lesson[0] : lesson;
  const currentLessonNumber = parseInt(lessonParam as string, 10);
  const totalLessons = 5;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Fetch the session data
        const session = await axios.get('/api/auth/session');
        
        if (session && session.data.user) {
          // Extract only the userId from the session
          const userid = session.data.user.id;
          
          // Set the userId in state
          setUserId(userid);
        }
      } catch (error) {
        console.error('Error fetching user ID from session:', error);
      }
    };

    fetchUserId();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['lessonData', categoryParam, lessonParam],
    queryFn: () => fetchLesson(categoryParam as string, lessonParam as string),
    enabled: !!categoryParam && !!lessonParam,  // Enable query when params are available
  });

  const { data: lessonStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['lessonStatus', userId, categoryParam, lessonParam],
    queryFn: () => fetchLessonStatus(userId, categoryParam as string, lessonParam as string),
    enabled: !!userId && !!categoryParam && !!lessonParam,  // Enable query when params are available
  });

  if (isLoading || statusLoading) return <div>Loading...</div>;

  if (!data) return <div>No data available</div>;

  const { title, description, frequency, author, content } = data;

  const getFrequencyClass = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'high':
        return 'text-fuchsia-500';
      case 'medium':
        return 'text-blue-500';
      case 'low':
        return 'text-purple-500';
      default:
        return '';
    }
  };

  return (
    <div className="flex">
      <DynamicLessonsNavBar />
      <div className="flex-1 p-4 ml-72">
        <div className="flex justify-between mb-4">
          <PrevButton currentLessonNumber={currentLessonNumber} category={categoryParam} />
          <NextButton currentLessonNumber={currentLessonNumber} category={categoryParam} totalLessons={totalLessons} />
        </div>
        {frequency && <p className={`text-md mt-12 mb-2 ${getFrequencyClass(frequency)}`}>Frequency: {frequency}</p>}
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {author && <p className="text-md mb-4 text-gray-600">Author(s): {author}</p>}
        <p className="italic text-md mb-4">{description}</p>
        <LessonProgressDropdown
          userId={userId}
          category={categoryParam}
          lesson={lessonParam}
          initialStatus={lessonStatus} // Assuming the status is fetched from the API
        />
        <div className="mt-10 border border-gray-300 rounded-md p-4 mb-8 w-5/12">
          <TableOfContents content={content} />
        </div>
        <div className="prose mt-4 w-9/12">
          <Markdown options={{ 
            overrides: {
              h1: { component: 'h1', props: { className: 'text-3xl font-bold mt-8 mb-4' } },
              h2: { component: 'h2', props: { className: 'text-2xl font-bold mt-6 mb-4' } },
              h3: { component: 'h3', props: { className: 'text-xl font-bold mt-4 mb-4' } },
            } 
          }}>
            {content}
          </Markdown>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default StudyLessonPage;
