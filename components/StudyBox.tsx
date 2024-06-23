// components/StudyBox.tsx

'use client';
import Link from 'next/link';

interface StudyBoxProps {
  division: string;
  specialty: string;
}

const StudyBox: React.FC<StudyBoxProps> = ({ division, specialty }) => {
  return (
    //<div className="border rounded p-4 m-2 bg-white shadow-md">
      <Link href={`/${division}/${specialty}`} className="block border rounded p-6 mr-8 mt-4 mb-4 bg-white shadow-md hover:bg-beige-200 text-lg font-semibold text-center transition-colors duration-300">{specialty}
      </Link>
    //</div>
  );
};

export default StudyBox;
