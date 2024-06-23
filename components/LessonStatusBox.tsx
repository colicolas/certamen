'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface LessonStatusBoxProps {
  division: string;
  specialty: string;
  lessons: string[];
}

const LessonStatusBox: React.FC<LessonStatusBoxProps> = ({ division, specialty, lessons }) => {
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

  return (
    <div className="border rounded p-6 m-4 bg-gray-800 shadow-md text-lg font-semibold text-center">
      <div className="text-xl mb-4">Lessons' Progress</div>
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
    </div>
  );
};

export default LessonStatusBox;
