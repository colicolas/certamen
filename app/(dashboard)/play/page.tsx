'use client';

import { useState, useRef } from 'react';

export default function PlayPage() {
  const [mode, setMode] = useState('FFA');
  const [code, setCode] = useState(['', '', '', '']);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[A-Za-z0-9]$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    if (index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };


  const createGame = () => {
    const code = [...Array(4)].map(() =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    window.location.href = `/play/${code}`;
  };

  const joinGame = () => {
    const joinedCode = code.join('');
    if (joinedCode.length === 4) {
      window.location.href = `/play/${joinedCode}`;
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newCode = [...code];

      if (newCode[index]) {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }

      e.preventDefault();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6">
      <h1 className="text-4xl mt-20 font-semibold mb-6 text-center">PLAY CERTAMEN</h1>

      <div className="mb-6">
        <select
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="FFA">Free-for-All</option>
          <option value="TEAMS" disabled>Teams (coming soon)</option>
        </select>
      </div>

      <div className="flex justify-between gap-2 mb-6">
        {code.map((char, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
          />
        ))}
      </div>

      <button onClick={joinGame} className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300">
        Join Game
      </button>

      <p className="text-center text-sm mt-4 text-gray-500">or</p>

      <button
        onClick={createGame}
        className="w-full bg-zinc-200 text-black py-2 mt-2 rounded-md hover:bg-zinc-300 transition duration-300"
      >
        Create Game
      </button>
    </div>
  );
}
