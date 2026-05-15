// Роли пользователей
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

// Пользователь из БД
export interface User {
  id: string;
  username: string;
  nick: string;
  balance: number;
  totalBets: number;
  totalWagered: number;
  totalDeposit: number;
  avatarColor: string;
  role: UserRole;
  data: Record<string, any>;
}

// Транзакция
export interface Transaction {
  id: number;
  userId: string;
  type: 'deposit' | 'withdraw' | 'promo' | 'refund';
  amount: number;
  method?: string;
  wallet?: string;
  fee?: number;
  status: 'pending' | 'processing' | 'success' | 'cancelled';
  createdAt: string;
}

// Ставка
export interface Bet {
  id: number;
  userId: string;
  roomId: string;
  amount: number;
  win: boolean;
  ticket: number;
  createdAt: string;
}

// Конфигурация бота
export interface BotConfig {
  id: number;
  name: string;
  color: string;
  avatar: string;
  minBet: number;
  maxBet: number;
  chance: number;
  rooms: string[];
}

// Комната
export interface RoomState {
  bank: number;
  players: Player[];
  timer: number;
  maxTimer: number;
  lastWinner: Winner | null;
}

// Игрок (бот или реальный)
export interface Player {
  userId?: string;
  name: string;
  color: string;
  avatar?: string;
  bet: number;
  tickets: number;
  isBot: boolean;
}

// Победитель раунда
export interface Winner {
  name: string;
  color: string;
  avatar?: string;
  amount: number;
  userId?: string;
  isBot: boolean;
  ticket: number;
}

// Сообщение чата
export interface ChatMessage {
  id: number;
  userId: string;
  username: string;
  text: string;
  replyTo: number | null;
  createdAt: string;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
