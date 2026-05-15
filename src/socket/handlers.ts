import { Server, Socket } from 'socket.io';
import { ClientEvent, ServerEvent } from './events';
import * as gameService from '../services/game.service';
import * as walletService from '../services/wallet.service';
import * as chatService from '../services/chat.service';

export function registerHandlers(io: Server, socket: Socket) {
  // Обработка ставки
  socket.on(ClientEvent.PLACE_BET, async (data: { roomId: string; amount: number; token: string }) => {
    try {
      const userId = socket.data.userId || 'demo_user';

      const balance = await walletService.getUserBalance(userId);
      const error = gameService.validateBet(data.roomId, data.amount, 0, balance);

      if (error) {
        socket.emit('error', { message: error });
        return;
      }

      await walletService.deductBalance(userId, data.amount);
      gameService.placeBet(userId, data.roomId, data.amount);

      // Оповещаем всех о новой ставке
      io.emit(ServerEvent.NEW_BET, { roomId: data.roomId });

      // Отправляем игроку его новый баланс
      const newBalance = await walletService.getUserBalance(userId);
      socket.emit(ServerEvent.BALANCE_UPDATE, { balance: newBalance });
    } catch (e: any) {
      socket.emit('error', { message: e.message });
    }
  });

  // Обработка сообщения в чат
  socket.on(ClientEvent.SEND_MESSAGE, async (data: { text: string; replyTo?: number; token: string }) => {
    try {
      const userId = socket.data.userId || 'demo_user';
      const username = socket.data.username || 'Player';

      const msg = await chatService.sendMessage({
        userId,
        username,
        text: data.text,
        replyTo: data.replyTo || null,
      });

      // Рассылаем сообщение всем
      io.emit(ServerEvent.NEW_MESSAGE, msg);
    } catch (e: any) {
      socket.emit('error', { message: e.message });
    }
  });
}
