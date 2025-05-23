import { useRouter } from 'next/navigation';
import React from 'react';

interface NextButtonProps {
  currentLessonNumber: number;
  category: string;
  totalLessons: number;
}

const NextButton: React.FC<NextButtonProps> = ({ currentLessonNumber, category, totalLessons }) => {
  const router = useRouter();

  const handleNext = () => {
    if (currentLessonNumber < totalLessons) {
      router.push(`/study/${category}/${currentLessonNumber + 1}`);
    }
  };

  return currentLessonNumber < totalLessons ? (
    <button
      onClick={handleNext}
      className="mr-80 mt-4 text-black rounded hover:opacity-70 duration-300"
    >
      Next &gt;
    </button>
  ) : null;
};

export default NextButton;
