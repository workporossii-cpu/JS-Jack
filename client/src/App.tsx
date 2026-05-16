import { useSocket } from './hooks/useSocket';
import { GamePage } from './pages/GamePage';
import { WalletPage } from './pages/WalletPage';
import { ProfilePage } from './pages/ProfilePage';
import { BonusPage } from './pages/BonusPage';
import { ChatPanel } from './components/ChatPanel';
import { NavBar } from './components/NavBar';
import { useState } from 'react';

export default function App() {
  const socket = useSocket();
  const [page, setPage] = useState('jackpot');
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="game-title">SJ</span>
      </header>

      <main className="app-content">
        {page === 'jackpot' && <GamePage socket={socket} />}
        {page === 'wallet' && <WalletPage socket={socket} />}
        {page === 'profile' && <ProfilePage socket={socket} />}
        {page === 'bonus' && <BonusPage socket={socket} />}
      </main>

      {chatOpen && <ChatPanel socket={socket} onClose={() => setChatOpen(false)} />}

      <NavBar currentPage={page} onNavigate={setPage} onChat={() => setChatOpen(!chatOpen)} />
    </div>
  );
}
