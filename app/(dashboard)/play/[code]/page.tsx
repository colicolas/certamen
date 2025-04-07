'use client';

import { useState, useEffect } from 'react';
import GameSettings from '@/components/GameSettings';

export default function GameRoom() {
  const [gameStarted, setGameStarted] = useState(false);
  const [dotCount, setDotCount] = useState(1);
  const isOwner = true;

  const dummyPlayers = [
    { name: 'Demi', division: 'HS2', specialties: ['History'], pfp: '🧠' },
    { name: 'Kayla', division: 'HS Adv', specialties: ['Culture'], pfp: '📚' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const waitingText = '.'.repeat(dotCount) + ' '.repeat(3 - dotCount);

  return (
    <div className="flex flex-col w-full h-screen">
      {!gameStarted ? (
        <div className="p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 mt-32">Players in Lobby</h2>
            <div className="grid grid-cols-2 gap-4">
              {dummyPlayers.map((p, i) => (
                <div key={i} className="p-4 bg-white rounded-lg border shadow">
                  <div className="text-2xl">{p.pfp}</div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.division}</div>
                  <div className="text-xs text-gray-400">
                    {p.specialties.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GameSettings isOwner={isOwner} />

          {dummyPlayers.length < 2 ? (
            <div className="w-full text-center text-gray-500 text-sm mt-4">
              Waiting for players{waitingText}
            </div>
          ) : (
            <button
              onClick={() => setGameStarted(true)}
              className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Start Game
            </button>
          )}
        </div>
      ) : (
        <div> {/* game UI goes here later */} </div>
      )}
    </div>
  );
}
