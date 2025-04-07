'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const params = useParams<{ category: string; lesson: string }>();
  const category = params?.category ?? '';
  const lesson = params?.lesson ?? '';

  const getHeaders = (markdown: string) => {
    const headers = markdown.match(/^(### |## |# )(.*)/gm);
    return headers ? headers.map(header => {
      const level = header.startsWith('###') ? 3 : header.startsWith('##') ? 2 : 1;
      const text = header.replace(/^(### |## |# )/, '');
      return { level, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
    }) : [];
  };

  const headers = getHeaders(content);

  return (
    <nav>
      <h2 className="font-bold text-xl mb-2">Table of Contents</h2>
      <ul className="list-none border-l border-gray-300 pl-4">
        {headers.map(header => (
          <li key={uuidv4()} className={`ml-${(header.level - 1) * 4} mb-2 relative`}>
            <span className="absolute -left-4 border-l border-gray-300 h-full" />
            <Link href={`/study/${(category as string).toLowerCase()}/${lesson}#${header.id}`} className="transition duration-300 text-gray-800 hover:text-gray-600 hover:underline">
              {header.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
