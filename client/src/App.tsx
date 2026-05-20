import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!socket) return;
    const handler = ({ balance }: any) => setBalance(balance);
    socket.on('balance_update', handler);
    return () => { socket.off('balance_update', handler); };
  }, [socket]);

  return (
    <div style={{
      width: '100%', maxWidth: '420px', minHeight: '100vh', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#0b0d12',
      color: '#e4e4e7', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative', paddingBottom: '100px'
    }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 200, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
        background: '#111318', borderBottom: '1px solid #252830', minHeight: '48px'
      }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#a970ff', letterSpacing: '2px' }}>SJ</span>
      </header>
      <main style={{ flex: 1, padding: '12px', paddingBottom: '80px', overflowY: 'auto' }}>
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
