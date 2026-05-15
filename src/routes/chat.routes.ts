import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as chatService from '../services/chat.service';

const router = Router();

// Отправка сообщения
router.post('/send', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { text, replyTo } = req.body;
    const userId = req.user!.userId;
    const username = req.user!.userId; // В будущем можно брать ник из БД

    const message = await chatService.sendMessage({ userId, username, text, replyTo });
    res.json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение сообщений (открытый)
router.get('/messages', async (req: Request, res: Response) => {
  const messages = await chatService.getMessages(100);
  res.json(messages);
});

export default router;
