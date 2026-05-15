import { pool } from '../db/pool';
import { Transaction } from '../types';

export interface DepositParams {
  userId: string;
  method: string;
  amount: number;
  wallet?: string;
}

export interface WithdrawParams {
  userId: string;
  method: string;
  amount: number;
  wallet?: string;
}

// Расчёт комиссии
export function calculateFee(method: string, amount: number): number {
  if (method === 'usdt') return Math.round(amount * 0.05 + 350);
  if (method === 'ton') return 5;
  return 0; // СБП, карта, crypto bot — без комиссии
}

// Создание заявки на пополнение
export async function createDeposit(params: DepositParams): Promise<Transaction> {
  const { userId, method, amount, wallet } = params;

  const { rows } = await pool.query(
    `INSERT INTO transactions (user_id, type, amount, method, wallet, status)
     VALUES ($1, 'deposit', $2, $3, $4, 'pending')
     RETURNING *`,
    [userId, amount, method, wallet || null]
  );

  return rows[0];
}

// Создание заявки на вывод
export async function createWithdraw(params: WithdrawParams): Promise<Transaction> {
  const { userId, method, amount, wallet } = params;

  // Проверяем баланс
  const { rows: userRows } = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
  if (!userRows[0] || userRows[0].balance < amount) {
    throw new Error('Недостаточно средств');
  }

  const fee = calculateFee(method, amount);
  const totalWithFee = amount - fee;

  if (totalWithFee <= 0) {
    throw new Error('Сумма меньше комиссии');
  }

  // Списываем баланс
  await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);

  // Создаём транзакцию
  const { rows } = await pool.query(
    `INSERT INTO transactions (user_id, type, amount, method, wallet, fee, status)
     VALUES ($1, 'withdraw', $2, $3, $4, $5, 'processing')
     RETURNING *`,
    [userId, amount, method, wallet || null, fee]
  );

  return rows[0];
}

// Получить историю транзакций пользователя
export async function getUserTransactions(userId: string, limit = 50): Promise<Transaction[]> {
  const { rows } = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC LIMIT $2',
    [userId, limit]
  );
  return rows;
}

// Получить историю ставок пользователя
export async function getUserBets(userId: string, limit = 50) {
  const { rows } = await pool.query(
    'SELECT * FROM bets WHERE user_id = $1 ORDER BY id DESC LIMIT $2',
    [userId, limit]
  );
  return rows;
}

// Получить баланс пользователя
export async function getUserBalance(userId: string): Promise<number> {
  const { rows } = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
  return rows[0]?.balance || 0;
}

// Списать средства (для ставки)
export async function deductBalance(userId: string, amount: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    'UPDATE users SET balance = balance - $1, total_bets = total_bets + 1, total_wagered = total_wagered + $1 WHERE id = $2 AND balance >= $1',
    [amount, userId]
  );
  return (rowCount ?? 0) > 0;
}

// Начислить средства (выигрыш, бонус)
export async function addBalance(userId: string, amount: number): Promise<void> {
  await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId]);
}
