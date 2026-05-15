import express from 'express';
import http from 'http';
import { securityMiddleware } from './middleware/security';
import { initializeDatabase } from './db/init';
import * as gameService from './services/game.service';
import { initSocket, getIO } from './socket';
import { ServerEvent } from './socket/events';
import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import walletRoutes from './routes/wallet.routes';
import chatRoutes from './routes/chat.routes';
import adminRoutes from './routes/admin.routes';
import { config } from './config';

const app = express();
const server = http.createServer(app);

// Инициализация Socket.IO
initSocket(server);

// Безопасность
app.use(securityMiddleware);
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'SJ CASINO Server v2.0' });
});

async function start() {
  try {
    await initializeDatabase();

    gameService.initGameService();
    await gameService.loadBotConfigs();

    for (const roomId of Object.keys(gameService.getRoomsState())) {
      gameService.genBots(roomId);
    }

    // Отправляем состояние комнат каждую секунду
    setInterval(() => {
      const rooms = gameService.getRoomsState();
      getIO().emit(ServerEvent.ROOM_STATE, rooms);
    }, 1000);

    // Таймер и розыгрыш
    setInterval(() => {
      for (const roomId of Object.keys(gameService.getRoomsState())) {
        const room = gameService.getRoomState(roomId);
        if (!room) continue;

        if (room.timer > 0) {
          room.timer--;

          if (room.timer === 0) {
            // Запускаем анимацию на всех клиентах
            getIO().emit(ServerEvent.ROUND_START, { roomId });

            // Через 12 секунд определяем победителя
            setTimeout(() => {
              const winner = gameService.resolveRound(roomId);
              if (winner) {
                getIO().emit(ServerEvent.ROUND_END, { roomId, winner });

                // Персональное уведомление победителю
                if (winner.userId) {
                  const sockets = getIO().sockets.sockets;
                  for (const [, s] of sockets) {
                    if (s.data.userId === winner.userId) {
                      s.emit(ServerEvent.USER_WON, {
                        amount: winner.amount,
                        roomId,
                      });
                      break;
                    }
                  }
                }
              }
            }, 12000);
          }
        }
      }
    }, 1000);

    server.listen(config.port, () => {
      console.log(`✅ SJ CASINO Server v2.0 running on port ${config.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
