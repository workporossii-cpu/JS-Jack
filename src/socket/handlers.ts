import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ClientEvent, ServerEvent } from './events';
import * as gameService from '../services/game.service';
import * as walletService from '../services/wallet.service';
import * as chatService from '../services/chat.service';
import { config } from '../config';
import { JwtPayload } from '../types';

function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}

export function registerHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId;
  const username = socket.data.username || 'Player';

  socket.on(ClientEvent.PLACE_BET, async (data: { roomId: string; amount: number; token: string }) => {
    try {
      const payload = verifyToken(data.token);
      if (!payload) {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }

      const balance = await walletService.getUserBalance(userId);
      const error = gameService.validateBet(data.roomId, data.amount, 0, balance);

      if (error) {
        socket.emit('error', { message: error });
        return;
      }

      await walletService.deductBalance(userId, data.amount);
      gameService.placeBet(userId, data.roomId, data.amount);

      io.emit(ServerEvent.NEW_BET, { roomId: data.roomId });

      const newBalance = await walletService.getUserBalance(userId);
      socket.emit(ServerEvent.BALANCE_UPDATE, { balance: newBalance });
    } catch (e: any) {
      socket.emit('error', { message: e.message });
    }
  });

  socket.on(ClientEvent.SEND_MESSAGE, async (data: { text: string; replyTo?: number; token: string }) => {
    try {
      const payload = verifyToken(data.token);
      if (!payload) {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }

      const msg = await chatService.sendMessage({
        userId,
        username,
        text: data.text,
        replyTo: data.replyTo || null,
      });

      io.emit(ServerEvent.NEW_MESSAGE, msg);
    } catch (e: any) {
      socket.emit('error', { message: e.message });
    }
  });
}
