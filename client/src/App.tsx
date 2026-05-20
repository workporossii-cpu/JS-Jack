import { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import GamePage from './pages/GamePage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import BonusPage from './pages/BonusPage';
import AdminPage from './pages/AdminPage';
import NavBar from './components/NavBar';
import ChatPanel from './components/ChatPanel';

export default function App() {
  const socket = useSocket();
  const [page, setPage] = useState('jackpot');
  const [chatOpen, setChatOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  socket?.on('balance_update', ({ balance }: any) => setBalance(balance));
  socket?.on('room_state', (rooms: any) => {
    // handled inside GamePage via store
  });

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="top-logo-placeholder">SJ</span>
      </header>
      <main className="app-content">
        {page === 'jackpot' && <GamePage />}
        {page === 'wallet' && <WalletPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'bonus' && <BonusPage />}
        {page === 'admin' && <AdminPage />}
      </main>
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      <NavBar currentPage={page} onNavigate={setPage} onChat={() => setChatOpen(!chatOpen)} balance={balance} />
    </div>
  );
}