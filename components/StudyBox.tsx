// components/StudyBox.tsx
'use client';
import Link from 'next/link';

interface StudyBoxProps {
  division: string;
  specialty: string;
  lessons: string[];
  totalLessons: number; // Total number of lessons for the category
}

const StudyBox: React.FC<StudyBoxProps> = ({ division, specialty, lessons, totalLessons }) => {
  const completedLessons = lessons.filter(lesson => lesson.includes(`${division}/${specialty}/`) && lesson.endsWith('-complete')).length;
  const inProgressLessons = lessons.filter(lesson => lesson.includes(`${division}/${specialty}/`) && lesson.endsWith('-progress')).length;
  const unstartedLessons = totalLessons - completedLessons - inProgressLessons;

  return (
    <Link href={`/${division}/${specialty}`} className="block border rounded p-6 m-4 bg-beige-200 shadow-md hover:bg-beige-300 text-lg font-semibold text-center transition-colors duration-300">
      <div className="text-xl mb-4">{specialty.charAt(0).toUpperCase() + specialty.slice(1)}</div>
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
