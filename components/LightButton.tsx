import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  text: string;
  link: string;
  style?: string;
  color?: string;
  number?: int;
};

const LightButton: React.FC<ButtonProps> = ({ text, link, style, color="beige", number=300 }) => {
  return (
    <Link className={`border border-gray-800 text-gray-800 bg-${color}-${number} py-2 px-4 rounded transition duration-300 hover:bg-${color}-${number+200} ${style}"`} href={link} passHref>
        {text}
    </Link>
  );
};

export default LightButton; 
