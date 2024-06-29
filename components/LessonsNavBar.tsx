'use client';
import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

interface LessonStatus {
  number: number;
  status: 'unstarted' | 'progress' | 'complete';
}

const LessonsNavBar: React.FC = () => {
  const { userData, loading } = useUser();
  const { division, category } = useParams();
  const pathname = usePathname();
  const [lessons, setLessons] = useState<LessonStatus[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    if (!loading && userData && division && category) {
      const fetchLessons = async () => {
        try {
          const lessonsRes = await axios.get(`/api/lessons/${division}/${category}`);
          const { totalLessons } = lessonsRes.data;

          const lessonsData = Array.from({ length: totalLessons }, (_, i) => ({
            number: i + 1,
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
    }
  }, [loading, userData, division, category]);

  const getLessonStatus = (userLessons: string[], division: string, category: string, lessonNumber: number) => {
    const lessonPath = `${division}/${category}/${lessonNumber}`;
    if (userLessons.includes(`${lessonPath}-complete`)) return 'complete';
    if (userLessons.includes(`${lessonPath}-progress`)) return 'progress';
    return 'unstarted';
  };

  if (loading || !division || !category) {
    return null;
  }

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        <Link href={`/study/${division}/${category}`} className="hover:underline">
          {division.toUpperCase()}: {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      </h2>
      <p className="text-sm mb-4">{progress.completed}/{progress.total} complete</p>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.number} className={`mb-2 ${lesson.status === 'complete' ? 'text-indigo-600' : lesson.status === 'progress' ? 'text-blue-500' : ''}`}>
            <Link href={`/study/${division}/${category}/${lesson.number}`} className={`block p-2 rounded ${lesson.status === 'complete' ? 'bg-indigo-200' : lesson.status === 'progress' ? 'bg-blue-200' : 'bg-gray-200'} ${pathname.endsWith(`/${lesson.number}`) ? 'bg-gray-300 font-bold' : ''} hover:${lesson.status === 'complete' ? 'bg-indigo-300' : lesson.status === 'progress' ? 'bg-blue-300' : 'bg-gray-300'}`}
              >
                Lesson {lesson.number}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonsNavBar;
/*import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface LessonStatus {
  number: number;
  status: 'unstarted' | 'progress' | 'complete';
}

const LessonsNavBar: React.FC = () => {
  const { division, category, lesson } = useParams();
  const pathname = usePathname();
  const [lessons, setLessons] = useState<LessonStatus[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const session = await axios.get('/api/auth/session');
        if (session && session.data.user) {
          const userRes = await axios.get(`/api/user/${session.data.user.id}`);
          const userLessons = userRes.data.lessons || [];
          const lessonsRes = await axios.get(`/api/lessons/${division}/${category}`);
          const { totalLessons } = lessonsRes.data;

          const lessonsData = Array.from({ length: totalLessons }, (_, i) => ({
            number: i + 1,
            status: getLessonStatus(userLessons, division, category, i + 1),
          }));

          const completed = lessonsData.filter(lesson => lesson.status === 'complete').length;

          setLessons(lessonsData);
          setProgress({ completed, total: totalLessons });
        }
      } catch (error) {
        console.error('Error fetching lessons data:', error);
      }
    };

    if (division && category) {
      fetchLessons();
    }
  }, [division, category]);

  const getLessonStatus = (userLessons: string[], division: string, category: string, lessonNumber: number) => {
    const lessonPath = `${division}/${category}/${lessonNumber}`;
    if (userLessons.includes(`${lessonPath}-complete`)) return 'complete';
    if (userLessons.includes(`${lessonPath}-progress`)) return 'progress';
    return 'unstarted';
  };

  if (!division || !category) {
    return null;
  }

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        <Link href={`/study/${division}/${category}`} className="hover:underline">
          {division.toUpperCase()}: {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      </h2>
      <p className="text-sm mb-4">{progress.completed}/{progress.total} complete</p>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.number} className={`mb-2 ${lesson.status === 'complete' ? 'text-indigo-600' : lesson.status === 'progress' ? 'text-blue-500' : ''}`}>
            <Link href={`/study/${division}/${category}/${lesson.number}`} className={`block p-2 rounded ${lesson.status === 'complete' ? 'bg-indigo-200' : lesson.status === 'progress' ? 'bg-blue-200' : 'bg-gray-200'} ${pathname.endsWith(`/${lesson.number}`) ? 'bg-gray-300 font-bold' : ''} hover:${lesson.status === 'complete' ? 'bg-indigo-300' : lesson.status === 'progress' ? 'bg-blue-300' : 'bg-gray-300'}`}
              >
                Lesson {lesson.number}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonsNavBar;*/
