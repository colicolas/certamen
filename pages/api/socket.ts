// pages/api/socket.ts
import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import type { NextApiResponseServerIO } from '@/types/next';

let playerMap: Record<string, any[]> = {};
let roomOwnerMap: Record<string, string> = {};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket?.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('join-room', ({ roomId, isOwner, ...playerData }) => {
        socket.join(roomId);

        if (!playerMap[roomId]) {
          playerMap[roomId] = [];
        }

        if (isOwner) {
          roomOwnerMap[roomId] = playerData.name;
        }

        const alreadyIn = playerMap[roomId].find((p) => p.name === playerData.name);
        if (!alreadyIn) {
          playerMap[roomId].push(playerData);
        }

        io.to(roomId).emit('player-joined', {
          players: playerMap[roomId],
          owner: roomOwnerMap[roomId] || null,
        });
      });

      socket.on('start-game', ({ roomId }) => {
        io.to(roomId).emit('game-started');
      });
    });
  }

  res.end();
}
