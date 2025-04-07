'use client';
import Link from 'next/link';

interface LessonLinkProps {
  category: string;
  lessonNumber: number;
  title: string;
  frequency: string;
  description: string;
  status: 'complete' | 'progress' | 'unstarted';
  isLeft: boolean;
}

const LessonLink: React.FC<LessonLinkProps> = ({ category, lessonNumber, title, frequency, description, status, isLeft }) => {
  const getFrequencyTextColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'high':
        return 'text-fuchsia-500';
      case 'medium':
        return 'text-blue-600';
      case 'low':
        return 'text-purple-500';
      default:
        return 'text-gray-800';
    }
  };

  const frequencyTextColor = getFrequencyTextColor(frequency);

  return (
    <Link href={`/study/${category}/${lessonNumber}`} className={`mb-8 flex justify-${isLeft ? 'start' : 'end'} items-center w-full`}>
      <div className="w-1/2 flex flex-col items-center border rounded p-4 bg-beige-200 hover:bg-beige-300 transition-colors duration-300">
        <div className={`relative flex items-center justify-center rounded-full w-10 h-10 ${status === 'complete' ? 'bg-indigo-300' : status === 'progress' ? 'bg-blue-500' : 'bg-gray-800'} cursor-pointer`} title={title}>
          {status !== 'unstarted' && <span className={`absolute inset-0 rounded-full ${status === 'complete' ? 'bg-indigo-300' : 'bg-blue-500'}`}></span>}
          <span className="text-white">{lessonNumber}</span>
        </div>
        <div className="mt-2 text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className={`text-sm ${frequencyTextColor}`}>Frequency: {frequency}</p>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default LessonLink;
