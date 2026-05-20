import { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import GamePage from './pages/GamePage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import BonusPage from './pages/BonusPage';
import AdminPage from './pages/AdminPage';
import NavBar from './components/NavBar';
import ChatPanel from './components/ChatPanel';
import BetHistory from './components/BetHistory';

export default function App() {
  const socket = useSocket();
  const [page, setPage] = useState('jackpot');
  const [chatOpen, setChatOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [betHistory, setBetHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!socket) return;
    const handleBalance = ({ balance }: any) => setBalance(balance);
    const handleBetHistory = (data: any[]) => setBetHistory(data);
    socket.on('balance_update', handleBalance);
    socket.on('bet_history', handleBetHistory);
    return () => {
      socket.off('balance_update', handleBalance);
      socket.off('bet_history', handleBetHistory);
    };
  }, [socket]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-logo">SJ</span>
        <span style={{ fontSize: '12px', color: 'var(--sub)' }}>⭐ {balance.toLocaleString()}</span>
      </header>
      <main className="app-content">
        {page === 'jackpot' && <GamePage />}
        {page === 'wallet' && <WalletPage />}
        {page === 'profile' && <ProfilePage betHistory={betHistory} />}
        {page === 'bonus' && <BonusPage />}
        {page === 'admin' && <AdminPage />}
      </main>
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      <NavBar currentPage={page} onNavigate={setPage} onChat={() => setChatOpen(!chatOpen)} balance={balance} />
    </div>
  );
}
