import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  text: string;
  link: string;
  style?: string;
  color?: string;
  number?: int; 
};

const DarkButton: React.FC<ButtonProps> = ({ text, link, style='', color="gray", number=800 }) => {
  const hoverClass = `hover:bg-${color}-${number - 200}`;
  const className = `border border-${color}-${number} bg-${color}-${number} text-white py-2 px-4 rounded transition duration-300 ${hoverClass} ${style}`;
  
  return (
    <Link className={className} href={link} passHref>
      {text}
    </Link>
  );
};

export default DarkButton;
