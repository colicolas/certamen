// components/StudyBox.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface StudyBoxProps {
  division: string;
  specialty: string;
  lessons: string[];
  title?: string;
}

const StudyBox: React.FC<StudyBoxProps> = ({ division, specialty, lessons, title }) => {
  const [totalLessons, setTotalLessons] = useState<number>(0);

  useEffect(() => {
    const fetchTotalLessons = async () => {
      try {
        const res = await axios.get(`/api/lessons/${division}/${specialty}`);
        setTotalLessons(res.data.totalLessons);
      } catch (error) {
        console.error('Error fetching total lessons:', error);
      }
    };

    fetchTotalLessons();
  }, [division, specialty]);

  const completedLessons = lessons.filter(lesson => lesson.includes(`${division}/${specialty}/`) && lesson.endsWith('-complete')).length;
  const inProgressLessons = lessons.filter(lesson => lesson.includes(`${division}/${specialty}/`) && lesson.endsWith('-progress')).length;
  const unstartedLessons = totalLessons - completedLessons - inProgressLessons;
  const displayTitle = title || `${specialty.charAt(0).toUpperCase() + specialty.slice(1)}`;

  return (
    <Link href={`/study/${division}/${specialty}`} className="block border rounded p-6 bg-beige-200 shadow-md hover:bg-beige-300 text-lg font-semibold text-center transition-colors duration-300">
      <div className="text-xl mb-4">{displayTitle}</div>
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center mx-2">
          <div className="bg-indigo-300 text-black rounded-full w-12 h-12 flex items-center justify-center">{completedLessons}</div>
          <div className="text-xs mt-2">COMPLETED</div>
        </div>
        <div className="flex flex-col items-center mx-2">
          <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">{inProgressLessons}</div>
          <div className="text-xs mt-2">IN PROGRESS</div>
        </div>
        <div className="flex flex-col items-center mx-2">
          <div className="bg-fuchsia-600 text-white rounded-full w-12 h-12 flex items-center justify-center">{unstartedLessons}</div>
          <div className="text-xs mt-2">UNSTARTED</div>
        </div>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5">
        <div className="bg-indigo-300 h-2.5 rounded-l-full" style={{ width: `${(completedLessons / totalLessons) * 100}%` }}></div>
        <div className="bg-blue-500 h-2.5 rounded-r-full" style={{ width: `${(inProgressLessons / totalLessons) * 100}%` }}></div>
      </div>
    </Link>
  );
};

export default StudyBox;
