'use client';
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

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`/lessons/${division}/${category}/${lesson}.md`);
        const parsed = matter(res.data);
        setTitle(parsed.data.title);
        setDescription(parsed.data.description);
        setContent(parsed.content);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      }
    };

    fetchLesson();
  }, [division, category, lesson]);

  return (
    <div className="flex">
      <DynamicLessonsNavBar />
      <div className="flex-1 p-4 ml-72">
        <h1 className="text-4xl font-bold mb-4 mt-12">{title}</h1>
        <p className="text-lg mb-4">{description}</p>
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
      </div>
    </div>
  );
};

export default StudyLessonPage;
