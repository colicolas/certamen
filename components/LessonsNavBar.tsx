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
const getLessonStatus = (userLessons: string[], division: string, category: string, lessonNumber: number) => {
  const lessonPath = `${division}/${category}/${lessonNumber}`;
  if (userLessons.includes(`${lessonPath}-complete`)) return 'complete';
  if (userLessons.includes(`${lessonPath}-progress`)) return 'progress';
  return 'unstarted';
};

// Fetch lessons data
const fetchLessons = async (division: string, category: string) => {
  const res = await axios.get(`/api/lessons/${division}/${category}`);
  const { totalLessons, lessonFiles } = res.data;

  const lessonNames = await Promise.all(
    lessonFiles.map(async (file: string) => {
      try {
        const res = await axios.get(`/lessons/${division}/${category}/${file}`);
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
  const { division, category } = useParams();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Query to fetch lessons
  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['lessonsNavBarData', division, category],
    queryFn: () => fetchLessons((division as string).toUpperCase(), (category as string).toLowerCase()),
    enabled: !!division && !!category && !loading && !!userData, // Only run if the params and userData are ready
  });

  if (isLoading || loading) {
    return <div>Loading lessons...</div>;
  }

  const { totalLessons, lessonNames } = lessonData || { totalLessons: 0, lessonNames: [] };

  // Determine lesson statuses based on user's progress
  const lessons: LessonStatus[] = Array.from({ length: totalLessons }, (_, i) => ({
    number: i + 1,
    name: lessonNames[i],
    status: getLessonStatus(userData.lessons, division as string, category as string, i + 1),
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
              <Link href={`/study/${division}/${category}`} className="transition duration-300 hover:opacity-70">
              <FontAwesomeIcon icon={faArrowLeft} /> {" "}{" "}
                 {(division as string).toUpperCase()}: {(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}
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
                    href={`/study/${division}/${category}/${lesson.number}`}
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
/*'use client';
import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import matter from 'gray-matter';

interface LessonStatus {
  number: number;
  status: 'unstarted' | 'progress' | 'complete';
  name: string;
}

const LessonsNavBar: React.FC = () => {
  const { userData, loading } = useUser();
  const { division, category } = useParams();
  const pathname = usePathname();
  const [lessons, setLessons] = useState<LessonStatus[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (loading || !userData || !division || !category) {
        return;
      }

      try {
        const lessonsRes = await axios.get(`/api/lessons/${(division as string).toUpperCase()}/${(category as string).toLowerCase()}`);
        const { totalLessons, lessonFiles } = lessonsRes.data;

        const lessonNames = await Promise.all(
          lessonFiles.map(async (file: string) => {
            try {
              const res = await axios.get(`/lessons/${(division as string).toUpperCase()}/${(category as string).toLowerCase()}/${file}`);
              const content = res.data;
              const { data } = matter(content);
              return data.title || file; // Use the title if available, otherwise use the file name
            } catch (error) {
              console.error('Error fetching lesson file:', error);
              return file; // Return the file name if there's an error
            }
          })
        );

        const lessonsData: LessonStatus[] = Array.from({ length: totalLessons }, (_, i) => ({
          number: i + 1,
          name: lessonNames[i],
          status: getLessonStatus(userData.lessons, division as string, category as string, i + 1),
        }));

        const completed = lessonsData.filter(lesson => lesson.status === 'complete').length;

        setLessons(lessonsData);
        setProgress({ completed, total: totalLessons });
      } catch (error) {
        console.error('Error fetching lessons data:', error);
      }
    };

    fetchLessons();
  }, [loading, userData, division, category]);

  const getLessonStatus = (userLessons: string[], division: string, category: string, lessonNumber: number) => {
    const lessonPath = `${division}/${category}/${lessonNumber}`;
    if (userLessons.includes(`${lessonPath}-complete`)) return 'complete';
    if (userLessons.includes(`${lessonPath}-progress`)) return 'progress';
    return 'unstarted';
  };

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
              <Link href={`/study/${division}/${category}`} className="transition duration-300 hover:text-gray-700">
                {(division as string).toUpperCase()}: {(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}
              </Link>
            </h2>
          </div>
          <p className="text-sm mb-4">{progress.completed}/{progress.total} complete</p>
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
                    href={`/study/${division}/${category}/${lesson.number}`}
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

export default LessonsNavBar;*/
