import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import { pool } from '../db/pool';
import { JwtPayload, UserRole } from '../types';

const router = Router();

// Проверка подписи Telegram
function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  const parsed = new URLSearchParams(initData);
  const hash = parsed.get('hash');
  parsed.delete('hash');
  parsed.sort();
  let dataCheckString = '';
  for (const [key, value] of parsed.entries()) {
    dataCheckString += key + '=' + value + '\n';
  }
  dataCheckString = dataCheckString.slice(0, -1);
  const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken);
  const calculatedHash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');
  return calculatedHash === hash;
}

// Вход / регистрация через Telegram
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      res.status(400).json({ error: 'No initData provided' });
      return;
    }

    // Проверяем подпись
    const isValid = verifyTelegramWebAppData(initData, config.botToken);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    // Извлекаем пользователя
    const urlParams = new URLSearchParams(initData);
    const userData = JSON.parse(urlParams.get('user') || '{}');
    const userId = userData.id;
    const username = userData.username || userData.first_name || 'Player';

    // Создаём или обновляем пользователя в БД
    await pool.query(
      `INSERT INTO users (id, username, nick)
       VALUES ($1, $2, $2)
       ON CONFLICT (id) DO UPDATE SET username = $2`,
      [userId, username]
    );

    // Получаем пользователя
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = rows[0];

    // Генерируем JWT
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role as UserRole,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nick: user.nick,
        balance: user.balance,
        totalBets: user.total_bets,
        totalWagered: user.total_wagered,
        totalDeposit: user.total_deposit,
        avatarColor: user.avatar_color,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
