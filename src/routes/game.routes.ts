import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as gameService from '../services/game.service';
import * as walletService from '../services/wallet.service';

const router = Router();

// Все игровые маршруты требуют авторизации
router.use(authMiddleware);

// Получить состояние всех комнат
router.get('/rooms', (req: Request, res: Response) => {
  const rooms = gameService.getRoomsState();
  res.json(rooms);
});

// Получить состояние одной комнаты
router.get('/rooms/:roomId', (req: Request, res: Response) => {
  const room = gameService.getRoomState(req.params.roomId);
  if (!room) {
    res.status(404).json({ error: 'Комната не найдена' });
    return;
  }
  res.json(room);
});

// Сделать ставку
router.post('/bet', async (req: Request, res: Response) => {
  try {
    const { roomId, amount } = req.body;
    const userId = req.user!.userId;

    // Получаем текущий баланс
    const balance = await walletService.getUserBalance(userId);

    // Валидация
    const error = gameService.validateBet(roomId, amount, 0, balance);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    // Списываем баланс
    const deducted = await walletService.deductBalance(userId, amount);
    if (!deducted) {
      res.status(400).json({ error: 'Не удалось списать средства' });
      return;
    }

    // Принимаем ставку
    gameService.placeBet(userId, roomId, amount);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
