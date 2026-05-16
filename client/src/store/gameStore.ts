import { create } from 'zustand';

interface RoomState {
  bank: number;
  players: any[];
  timer: number;
  maxTimer: number;
  lastWinner: any | null;
}

interface GameState {
  currentRoom: string;
  rooms: Record<string, RoomState>;
  isSpinning: boolean;
  myBet: number;
  winnersHistory: any[];
  setCurrentRoom: (room: string) => void;
  setRooms: (rooms: Record<string, RoomState>) => void;
  setSpinning: (spinning: boolean) => void;
  setMyBet: (bet: number) => void;
  addWinner: (winner: any) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentRoom: 'bomj',
  rooms: {},
  isSpinning: false,
  myBet: 0,
  winnersHistory: [],
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRooms: (rooms) => set({ rooms }),
  setSpinning: (spinning) => set({ isSpinning: spinning }),
  setMyBet: (bet) => set({ myBet: bet }),
  addWinner: (winner) => set((state) => ({ winnersHistory: [winner, ...state.winnersHistory].slice(0, 20) })),
}));
