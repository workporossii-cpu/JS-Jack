import { RoomState, Player, Winner, BotConfig } from '../types';
import { pool } from '../db/pool';

const ROOM_CONFIGS = {
  bomj: { min: 1, max: 50 },
  classic: { min: 10, max: 500 },
  major: { min: 250, max: 5000 },
  hyena: { min: 5000, max: 25000 },
};

const TICKETS_PER_COIN = 10;
const HOUSE_FEE = 0.10;

const rooms: Record<string, RoomState> = {};
let botConfigs: BotConfig[] = [];

export function initGameService() {
  for (const id of Object.keys(ROOM_CONFIGS)) {
    rooms[id] = {
      bank: 0,
      players: [],
      timer: 30,
      maxTimer: 30,
      lastWinner: null,
    };
  }
  console.log('✅ Game rooms initialized');
}

export async function loadBotConfigs() {
  const { rows } = await pool.query('SELECT * FROM bot_configs');
  botConfigs = rows;
}

export function genBots(roomId: string) {
  const room = rooms[roomId];
  if (!room) return;

  room.bank = 0;
  room.players = room.players.filter(p => !p.isBot);

  const candidates = botConfigs.filter(b => b.rooms?.includes(roomId));
  if (candidates.length === 0) return;

  const count = 5 + Math.floor(Math.random() * 7);
  for (let i = 0; i < count; i++) {
    const cfg = candidates[Math.floor(Math.random() * candidates.length)];
    if (Math.random() > cfg.chance) continue;

    const bet = Math.floor(cfg.minBet + Math.random() * (cfg.maxBet - cfg.minBet + 1));
    room.players.push({
      name: cfg.name,
      color: cfg.color,
      avatar: cfg.avatar,
      bet,
      tickets: bet * TICKETS_PER_COIN,
      isBot: true,
    });
    room.bank += bet;
  }
}

export function getRoomsState(): Record<string, RoomState> {
  return rooms;
}

export function getRoomState(roomId: string): RoomState | undefined {
  return rooms[roomId];
}

export function validateBet(roomId: string, amount: number, currentUserBet: number, userBalance: number): string | null {
  const room = rooms[roomId];
  if (!room) return 'Комната не найдена';

  const config = ROOM_CONFIGS[roomId as keyof typeof ROOM_CONFIGS];
  if (amount < config.min) return `Минимальная ставка: ${config.min}`;
  if (amount > config.max) return `Максимальная ставка: ${config.max}`;
  if (currentUserBet + amount > config.max) return `Превышен лимит на раунд: ${config.max}`;
  if (amount > userBalance) return 'Недостаточно средств';

  return null;
}

export function placeBet(userId: string, roomId: string, amount: number) {
  const room = rooms[roomId];
  if (!room) return null;

  room.players.push({
    userId,
    name: 'Player',
    color: '#b8a9ff',
    bet: amount,
    tickets: amount * TICKETS_PER_COIN,
    isBot: false,
  });

  return room;
}

export function resolveRound(roomId: string): Winner | null {
  const room = rooms[roomId];
  if (!room || room.players.length === 0) {
    if (room) {
      room.timer = room.maxTimer;
      genBots(roomId);
    }
    return null;
  }

  const totalBank = room.bank;
  const totalTickets = room.players.reduce((sum, p) => sum + p.tickets, 0);
  const winningTicket = Math.floor(Math.random() * totalTickets);

  let cum = 0;
  let winner: Player = room.players[0];
  for (const p of room.players) {
    cum += p.tickets;
    if (winningTicket < cum) {
      winner = p;
      break;
    }
  }

  const fee = Math.floor(totalBank * HOUSE_FEE);
  const winAmount = totalBank - fee;

  const winnerData: Winner = {
    name: winner.name,
    color: winner.color,
    avatar: winner.avatar,
    amount: winAmount,
    userId: winner.userId,
    isBot: winner.isBot,
    ticket: winningTicket,
  };

  room.lastWinner = winnerData;

  if (!winner.isBot && winner.userId) {
    pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [winAmount, winner.userId]);
    pool.query('INSERT INTO bets (user_id, room_id, amount, win, ticket) VALUES ($1,$2,$3,true,$4)', [
      winner.userId, roomId, winner.bet, winningTicket,
    ]);
  }

  room.bank = 0;
  room.players = [];
  room.timer = room.maxTimer;
  genBots(roomId);

  return winnerData;
}
