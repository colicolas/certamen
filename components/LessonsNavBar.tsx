'use client';
import { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import matter from 'gray-matter';
import { useQuery } from '@tanstack/react-query';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface LessonStatus {
  number: number;
  status: 'unstarted' | 'progress' | 'complete';
  name: string;
}

// Helper function to get lesson status
const getLessonStatus = (userLessons: string[], category: string, lessonNumber: number) => {
  const lessonPath = `${category}/${lessonNumber}`;
  if (userLessons.includes(`${lessonPath}-complete`)) return 'complete';
  if (userLessons.includes(`${lessonPath}-progress`)) return 'progress';
  return 'unstarted';
};

// Fetch lessons data
const fetchLessons = async (category: string) => {
  const res = await axios.get(`/api/lessons/${category}`);
  const { totalLessons, lessonFiles } = res.data;

  const lessonNames = await Promise.all(
    lessonFiles.map(async (file: string) => {
      try {
        const res = await axios.get(`/lessons/${category}/${file}`);
        const content = res.data;
        const { data } = matter(content);
        return data.title || file; // Use title if available, otherwise file name
      } catch (error) {
        console.error('Error fetching lesson file:', error);
        return file; // Return the file name if there's an error
      }
    })
  );

  return { totalLessons, lessonNames };
};

const LessonsNavBar: React.FC = () => {
  const { userData, loading } = useUser();
  const { category } = useParams();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Query to fetch lessons
  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['lessonsNavBarData', category],
    queryFn: () => fetchLessons((category as string).toLowerCase()),
    enabled: !!category && !loading && !!userData, // Only run if the params and userData are ready
  });

  if (isLoading || loading) {
    return <div>Loading lessons...</div>;
  }

  const { totalLessons, lessonNames } = lessonData || { totalLessons: 0, lessonNames: [] };

  // Determine lesson statuses based on user's progress
  const lessons: LessonStatus[] = Array.from({ length: totalLessons }, (_, i) => ({
    number: i + 1,
    name: lessonNames[i],
    status: getLessonStatus(userData.lessons, category as string, i + 1),
  }));

  const completed = lessons.filter(lesson => lesson.status === 'complete').length;

  return (
    <div className="relative">
      {!isVisible &&
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      }
      {isVisible && (
        <div className="h-screen w-64 bg-beige-200 shadow-lg p-4 fixed border-r border-gray-300">
          <div className="mb-4">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="p-2 bg-white rounded-md shadow-md mb-4"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h2 className="text-xl font-bold">
              <Link href={`/study/${category}`} className="transition duration-300 hover:opacity-70">
              <FontAwesomeIcon icon={faArrowLeft} /> {" "}{" "}
                 {(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}
              </Link>
            </h2>
          </div>
          <p className="text-sm mb-4">{completed}/{totalLessons} complete</p>
          <div className="relative">
            <div className="absolute top-0 left-0 h-full border-l-2">
              {lessons.map((lesson, index) => {
                const statusColor =
                  lesson.status === 'complete'
                    ? 'border-indigo-600'
                    : lesson.status === 'progress'
                    ? 'border-blue-500'
                    : 'border-gray-300';
                return (
                  <div
                    key={lesson.number}
                    className={`h-6 w-6 rounded-full ${statusColor} mt-4 ml-2`}
                  ></div>
                );
              })}
            </div>
            <ul className="ml-10">
              {lessons.map((lesson) => (
                <li
                  key={lesson.number}
                  className={`mb-2 w-full ${lesson.status === 'complete' ? 'text-indigo-600' : lesson.status === 'progress' ? 'text-blue-500' : ''}`}
                >
                  <Link
                    href={`/study/${category}/${lesson.number}`}
                    className={`block p-2 ${pathname.endsWith(`/${lesson.number}`) ? 'font-bold' : ''} transition duration-300 hover:opacity-75`}
                  >
                    {lesson.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsNavBar;
