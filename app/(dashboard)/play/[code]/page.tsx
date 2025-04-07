'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GameSettings from '@/components/GameSettings';
import socket from '@/lib/socket';

export default function GameRoom() {
  const { code } = useParams() as { code: string };
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<
    { name: string; division: string; specialties: string[]; pfp: string }[]
  >([]);
  const [roomOwner, setRoomOwner] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [dotCount, setDotCount] = useState(1);

  const waitingText = '.'.repeat(dotCount) + ' '.repeat(3 - dotCount);
  const isOwner = user?.username === roomOwner;

  useEffect(() => {
    const stored = sessionStorage.getItem('certamen-user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user) return;

    socket.connect();

    const isOwner = sessionStorage.getItem('certamen-is-owner') === 'true';

    socket.emit('join-room', {
      roomId: code,
      name: user.username,
      division: user.division,
      specialties: user.specialties,
      pfp: user.pfp || '🧠',
      isOwner,
    });

    socket.on('player-joined', ({ players, owner }) => {
      setPlayers(players);
      setRoomOwner(owner);
    });

    socket.on('game-started', () => {
      setGameStarted(true);
    });

    const interval = setInterval(() => {
      setDotCount((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => {
      socket.off('player-joined');
      socket.off('game-started');
      clearInterval(interval);
      socket.disconnect();
    };
  }, [user, code]);

  const startGame = () => {
    socket.emit('start-game', { roomId: code });
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {!gameStarted ? (
        <div className="p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 mt-32">Players in Lobby</h2>
            <div className="grid grid-cols-5 gap-4">
              {players.map((p, i) => (
                <div key={i} className="p-4 bg-white rounded-lg border shadow">
                  <div className="text-2xl">{p.pfp}</div>
                  <div className="font-semibold">
                    {p.name}
                    {p.name === roomOwner && (
                      <span className="ml-1 text-xs text-indigo-600">(owner)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{p.division}</div>
                  <div className="text-xs text-gray-400">
                    {p.specialties.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GameSettings isOwner={isOwner} />

          {players.length < 2 ? (
            <div className="w-full text-center text-gray-500 text-sm mt-4">
              Waiting for players{waitingText}
            </div>
          ) : (
            isOwner && (
              <button
                onClick={startGame}
                className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
              >
                Start Game
              </button>
            )
          )}
        </div>
      ) : (
        <div className="text-center text-2xl text-green-600 mt-32 font-bold">
          Game has started!
        </div>
      )}
    </div>
  );
}
