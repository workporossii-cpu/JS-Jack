import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as walletService from '../services/wallet.service';

const router = Router();

router.use(authMiddleware);

// Пополнить
router.post('/deposit', async (req: Request, res: Response) => {
  try {
    const { method, amount, wallet } = req.body;
    const userId = req.user!.userId;

    const transaction = await walletService.createDeposit({ userId, method, amount, wallet });
    res.json({ success: true, transaction });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Вывести
router.post('/withdraw', async (req: Request, res: Response) => {
  try {
    const { method, amount, wallet } = req.body;
    const userId = req.user!.userId;

    const transaction = await walletService.createWithdraw({ userId, method, amount, wallet });
    res.json({ success: true, transaction });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// История транзакций
router.get('/transactions', async (req: Request, res: Response) => {
  const transactions = await walletService.getUserTransactions(req.user!.userId);
  res.json(transactions);
});

// История ставок
router.get('/bets', async (req: Request, res: Response) => {
  const bets = await walletService.getUserBets(req.user!.userId);
  res.json(bets);
});

// Баланс
router.get('/balance', async (req: Request, res: Response) => {
  const balance = await walletService.getUserBalance(req.user!.userId);
  res.json({ balance });
});

export default router;
