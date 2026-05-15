import { pool } from '../db/pool';
import { BotConfig, Transaction } from '../types';

// ========== БОТЫ ==========

// Получить всех ботов
export async function getBots(): Promise<BotConfig[]> {
  const { rows } = await pool.query('SELECT * FROM bot_configs ORDER BY id');
  return rows;
}

// Добавить бота
export async function addBot(bot: Omit<BotConfig, 'id'>): Promise<BotConfig> {
  const { rows } = await pool.query(
    `INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [bot.name, bot.color, bot.avatar, bot.minBet, bot.maxBet, bot.chance, bot.rooms]
  );
  return rows[0];
}

// Обновить бота
export async function updateBot(id: number, bot: Partial<BotConfig>): Promise<BotConfig> {
  const { rows } = await pool.query(
    `UPDATE bot_configs
     SET name = COALESCE($1, name),
         color = COALESCE($2, color),
         avatar = COALESCE($3, avatar),
         min_bet = COALESCE($4, min_bet),
         max_bet = COALESCE($5, max_bet),
         chance = COALESCE($6, chance),
         rooms = COALESCE($7, rooms)
     WHERE id = $8
     RETURNING *`,
    [bot.name, bot.color, bot.avatar, bot.minBet, bot.maxBet, bot.chance, bot.rooms, id]
  );
  return rows[0];
}

// Удалить бота
export async function deleteBot(id: number): Promise<void> {
  await pool.query('DELETE FROM bot_configs WHERE id = $1', [id]);
}

// ========== ТРАНЗАКЦИИ ==========

// Получить все транзакции (для логов)
export async function getAllTransactions(limit = 100): Promise<Transaction[]> {
  const { rows } = await pool.query(
    'SELECT * FROM transactions ORDER BY id DESC LIMIT $1',
    [limit]
  );
  return rows;
}

// Подтвердить или отклонить заявку
export async function updateRequestStatus(requestId: number, status: 'success' | 'cancelled'): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM transactions WHERE id = $1', [requestId]);
  if (!rows[0]) throw new Error('Заявка не найдена');

  await pool.query('UPDATE transactions SET status = $1 WHERE id = $2', [status, requestId]);

  if (status === 'success' && rows[0].type === 'deposit') {
    await pool.query('UPDATE users SET balance = balance + $1, total_deposit = total_deposit + $1 WHERE id = $2', [
      rows[0].amount, rows[0].user_id,
    ]);
  }
}

// ========== ПОЛЬЗОВАТЕЛИ ==========

// Изменить баланс пользователю (админка)
export async function adjustUserBalance(targetUserId: string, amount: number): Promise<void> {
  await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, targetUserId]);
}

// Получить топ игроков
export async function getLeaderboard(limit = 10) {
  const { rows } = await pool.query(
    'SELECT username, balance FROM users ORDER BY balance DESC LIMIT $1',
    [limit]
  );
  return rows;
}
