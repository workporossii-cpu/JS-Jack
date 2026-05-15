import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import * as adminService from '../services/admin.service';

const router = Router();

// Все админ-маршруты требуют авторизации И роли ADMIN
router.use(authMiddleware);
router.use(adminMiddleware);

// Боты
router.get('/bots', async (req: Request, res: Response) => {
  const bots = await adminService.getBots();
  res.json(bots);
});

router.post('/bots', async (req: Request, res: Response) => {
  const bot = await adminService.addBot(req.body);
  res.json({ success: true, bot });
});

router.put('/bots/:id', async (req: Request, res: Response) => {
  const bot = await adminService.updateBot(parseInt(req.params.id), req.body);
  res.json({ success: true, bot });
});

router.delete('/bots/:id', async (req: Request, res: Response) => {
  await adminService.deleteBot(parseInt(req.params.id));
  res.json({ success: true });
});

// Транзакции (логи)
router.get('/transactions', async (req: Request, res: Response) => {
  const tx = await adminService.getAllTransactions();
  res.json(tx);
});

// Подтвердить / отклонить заявку
router.put('/requests/:id', async (req: Request, res: Response) => {
  const { status } = req.body;
  await adminService.updateRequestStatus(parseInt(req.params.id), status);
  res.json({ success: true });
});

// Топ игроков
router.get('/leaderboard', async (req: Request, res: Response) => {
  const top = await adminService.getLeaderboard();
  res.json(top);
});

export default router;
