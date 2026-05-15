import { pool } from './pool';

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    username TEXT,
    nick TEXT,
    balance INTEGER DEFAULT 0,
    total_bets INTEGER DEFAULT 0,
    total_wagered INTEGER DEFAULT 0,
    total_deposit INTEGER DEFAULT 0,
    avatar_color TEXT DEFAULT '#b8a9ff',
    role TEXT DEFAULT 'user',
    data JSONB DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    method TEXT,
    wallet TEXT,
    fee INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS bets (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    room_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    win BOOLEAN NOT NULL,
    ticket INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS promos (
    code TEXT PRIMARY KEY,
    multiplier REAL DEFAULT 1,
    max_uses INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    username TEXT,
    text TEXT NOT NULL,
    reply_to INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS bot_configs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    min_bet INTEGER NOT NULL,
    max_bet INTEGER NOT NULL,
    chance REAL DEFAULT 1.0,
    rooms TEXT[]
  );

  INSERT INTO promos (code, multiplier) VALUES ('WELCOME', 1) ON CONFLICT DO NOTHING;

  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'Crypto', '#f87171', '', 1, 10, 0.8, ARRAY['bomj','classic']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs LIMIT 1);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'TapMon', '#fb923c', '', 5, 50, 0.9, ARRAY['classic','major']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 2);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'Lucky', '#fbbf24', '', 100, 500, 0.7, ARRAY['major','hyena']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 3);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'TonRi', '#a3e635', '', 250, 1000, 0.6, ARRAY['classic','major','hyena']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 4);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'MegaT', '#34d399', '', 1000, 5000, 0.5, ARRAY['major','hyena']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 5);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'GoldD', '#22d3ee', '', 500, 2500, 0.75, ARRAY['classic','major']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 6);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'BigWi', '#60a5fa', '', 100, 2500, 0.65, ARRAY['classic','major','hyena']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 7);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'FastC', '#a78bfa', '', 1, 25, 0.9, ARRAY['bomj','classic']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 8);
  
  INSERT INTO bot_configs (name, color, avatar, min_bet, max_bet, chance, rooms)
  SELECT 'CoinH', '#f472b6', '', 10, 100, 0.85, ARRAY['bomj','classic','major']
  WHERE NOT EXISTS (SELECT 1 FROM bot_configs WHERE id = 9);
`;

export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
