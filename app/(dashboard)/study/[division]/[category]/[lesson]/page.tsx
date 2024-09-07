'use client';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import React from 'react';
import axios from 'axios';
import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
import TableOfContents from '@/components/TableOfContents';
import { useQuery } from '@tanstack/react-query';

const DynamicLessonsNavBar = dynamic(() => import('@/components/LessonsNavBar'), { ssr: false });

const fetchLesson = async (division: string, category: string, lesson: string) => {
  const res = await axios.get(`/lessons/${division}/${category}/${lesson}.md`);
  const parsed = matter(res.data);
  return {
    title: parsed.data.title,
    description: parsed.data.description,
    frequency: parsed.data.frequency,
    author: parsed.data.author,
    content: parsed.content,
  };
};

const StudyLessonPage: React.FC = () => {
  const { division, category, lesson } = useParams();
  const divisionParam = Array.isArray(division) ? division[0] : division;
  const categoryParam = Array.isArray(category) ? category[0] : category;
  const lessonParam = Array.isArray(lesson) ? lesson[0] : lesson;

  const { data, isLoading } = useQuery({
    queryKey: ['lessonData', divisionParam, categoryParam, lessonParam],
    queryFn: () => fetchLesson(divisionParam as string, categoryParam as string, lessonParam as string),
    enabled: !!divisionParam && !!categoryParam && !!lessonParam,  // Enable query when params are available
  });

  if (isLoading) return <div>Loading...</div>;

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
        {frequency && <p className={`text-md mt-12 mb-2 ${getFrequencyClass(frequency)}`}>Frequency: {frequency}</p>}
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {author && <p className="text-md mb-4 text-gray-600">Author(s): {author}</p>}
        <p className="italic text-md mb-4">{description}</p>
        <div className="border border-gray-300 rounded-md p-4 mb-8 w-5/12">
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
/*'use client';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
import TableOfContents from '@/components/TableOfContents';

const DynamicLessonsNavBar = dynamic(() => import('@/components/LessonsNavBar'), { ssr: false });

const StudyLessonPage: React.FC = () => {
  const { division, category, lesson } = useParams();
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`/lessons/${division}/${category}/${lesson}.md`);
        const parsed = matter(res.data);
        setTitle(parsed.data.title);
        setDescription(parsed.data.description);
        setFrequency(parsed.data.frequency);
        setAuthor(parsed.data.author);
        setContent(parsed.content);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      }
    };

    fetchLesson();
  }, [division, category, lesson]);

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
        {frequency && <p className={`text-md mt-12 mb-2 ${getFrequencyClass(frequency)}`}>Frequency: {frequency}</p>}
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {author && <p className="text-md mb-4 text-gray-600">Author(s): {author}</p>}
        <p className="italic text-md mb-4">{description}</p>
        <div className="border border-gray-300 rounded-md p-4 mb-8 w-5/12">
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

export default StudyLessonPage;*/
