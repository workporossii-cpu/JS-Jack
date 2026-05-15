import express from 'express';
import { securityMiddleware } from './middleware/security';
import { initializeDatabase } from './db/init';
import { initGameService, loadBotConfigs, genBots } from './services/game.service';
import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import walletRoutes from './routes/wallet.routes';
import chatRoutes from './routes/chat.routes';
import adminRoutes from './routes/admin.routes';
import { config } from './config';

const app = express();

// Безопасность
app.use(securityMiddleware);

// Парсинг JSON
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Здоровье сервера
app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'SJ CASINO Server v2.0' });
});

// Запуск
async function start() {
  try {
    // Инициализация БД
    await initializeDatabase();

    // Инициализация игры
    initGameService();
    await loadBotConfigs();

    // Генерация ботов для всех комнат
    for (const roomId of Object.keys(gameService.getRoomsState())) {
      genBots(roomId);
    }

    // Таймер для розыгрышей (каждую секунду)
    setInterval(() => {
      for (const roomId of Object.keys(gameService.getRoomsState())) {
        const room = gameService.getRoomState(roomId);
        if (room && room.timer > 0) {
          room.timer--;
          if (room.timer <= 0) {
            gameService.resolveRound(roomId);
          }
        }
      }
    }, 1000);

    app.listen(config.port, () => {
      console.log(`✅ SJ CASINO Server v2.0 running on port ${config.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
