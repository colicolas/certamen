import { useRouter } from 'next/navigation';
import React from 'react';

interface PrevButtonProps {
  currentLessonNumber: number;
  division: string;
  category: string;
}

const PrevButton: React.FC<PrevButtonProps> = ({ currentLessonNumber, division, category }) => {
  const router = useRouter();

  const handlePrev = () => {
    if (currentLessonNumber > 1) {
      router.push(`/study/${division}/${category}/${currentLessonNumber - 1}`);
    }
  };

  return currentLessonNumber > 1 ? (
    <button
      onClick={handlePrev}
      className="mt-4 text-black hover:opacity-70 duration-300"
    >
      &lt; Prev
    </button>
  ) : null;
};

export default PrevButton;
