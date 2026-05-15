import { pool } from '../db/pool';
import { ChatMessage } from '../types';

export interface SendMessageParams {
  userId: string;
  username: string;
  text: string;
  replyTo?: number | null;
}

// Отправить сообщение
export async function sendMessage(params: SendMessageParams): Promise<ChatMessage> {
  const { userId, username, text, replyTo } = params;

  const { rows } = await pool.query(
    `INSERT INTO chat_messages (user_id, username, text, reply_to)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, username, text, replyTo || null]
  );

  return rows[0];
}

// Получить последние сообщения
export async function getMessages(limit = 100): Promise<ChatMessage[]> {
  const { rows } = await pool.query(
    'SELECT * FROM chat_messages ORDER BY id DESC LIMIT $1',
    [limit]
  );
  return rows.reverse();
}

// Очистить чат (админка)
export async function clearChat(): Promise<void> {
  await pool.query('DELETE FROM chat_messages');
  await pool.query(
    `INSERT INTO chat_messages (user_id, username, text)
     VALUES (0, 'SJ CASINO', 'Чат очищен администратором.')`
  );
}
