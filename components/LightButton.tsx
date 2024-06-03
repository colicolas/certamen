import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  text: string;
  link: string;
  style?: string;
};

const LightButton: React.FC<ButtonProps> = ({ text, link, style }) => {
  return (
    <Link className="border border-gray-800 text-grey-800 bg-beige-300 py-2 px-4 rounded transition duration-300 hover:bg-beige-500 ${style}" href={link} passHref>
        {text}
    </Link>
  );
};

export default LightButton; 
