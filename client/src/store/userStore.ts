import { create } from 'zustand';

interface UserState {
  userId: string | null;
  username: string;
  balance: number;
  totalBets: number;
  totalDeposit: number;
  token: string | null;
  setUser: (user: Partial<UserState>) => void;
  setBalance: (balance: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: 'Player',
  balance: 0,
  totalBets: 0,
  totalDeposit: 0,
  token: localStorage.getItem('token'),
  setUser: (user) => set((state) => ({ ...state, ...user })),
  setBalance: (balance) => set({ balance }),
}));