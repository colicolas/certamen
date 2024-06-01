import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  text: string;
  link: string;
  style?: string;
};

const DarkButton: React.FC<ButtonProps> = ({ text, link, style='' }) => {
  return (
    <Link className="border border-gray-800 bg-gray-800 text-white py-2 px-4 rounded transition duration-300 hover:bg-gray-600 ${style}" href={link} passHref>
        {text}
    </Link>
  );
};

export default DarkButton;
