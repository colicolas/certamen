'use client';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const DynamicLessonsNavBar = dynamic(() => import('@/components/LessonsNavBar'), { ssr: false });

const StudyLessonPage: React.FC = () => {
  const { division, category, lesson } = useParams();

  return (
    <div className="flex">
      <DynamicLessonsNavBar />
      <div className="flex-1 p-4">
        {/* Your lesson content goes here */}
      </div>
    </div>
  );
};

export default StudyLessonPage;
