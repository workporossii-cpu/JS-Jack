import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { useSocket } from '../hooks/useSocket';

export default function GamePage() {
  const socket = useSocket();
  const { currentRoom, rooms, isSpinning, setRooms, setCurrentRoom, setSpinning, myBet, setMyBet, addWinner } = useGameStore();
  const { balance, setBalance } = useUserStore();
  const [betAmount, setBetAmount] = useState(10);

  const room = rooms[currentRoom] || { bank: 0, timer: 0, maxTimer: 30, players: [], lastWinner: null };

  useEffect(() => {
    if (!socket) return;
    socket.on('room_state', setRooms);
    socket.on('round_start', ({ roomId }: any) => { if (roomId === currentRoom) setSpinning(true); });
    socket.on('round_end', ({ roomId, winner }: any) => {
      if (roomId === currentRoom) { setSpinning(false); addWinner(winner); setMyBet(0); }
    });
    socket.on('balance_update', ({ balance }: any) => setBalance(balance));
    return () => {
      socket.off('room_state'); socket.off('round_start'); socket.off('round_end'); socket.off('balance_update');
    };
  }, [socket, currentRoom]);

  const placeBet = () => {
    if (isSpinning || betAmount < 1) return;
    socket?.emit('place_bet', { roomId: currentRoom, amount: betAmount, token: localStorage.getItem('token') || 'demo' });
    setMyBet(myBet + betAmount);
  };

  return (
    <div className="game-layout">
      <div className="rooms-bar">
        {Object.keys(rooms).map((id) => (
          <button key={id} className={`room-tab ${id === currentRoom ? 'active' : ''}`} onClick={() => setCurrentRoom(id)}>
            {{bomj:'Бомж',classic:'Классик',major:'Мажор',hyena:'Гиена'}[id]}
            <span className="room-tab-limits">{{bomj:'1-50',classic:'10-500',major:'250-5K',hyena:'5K-25K'}[id]}</span>
          </button>
        ))}
      </div>
      <div className="game-header">
        <div className="game-bank">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#f0b90b" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
            <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14l-6-4.5h7.5z"/>
          </svg>
          {room.bank.toLocaleString()}
        </div>
        <div className="game-timer">
          <div className="game-timer-bar"><div className="game-timer-fill" style={{width:`${(room.timer/room.maxTimer)*100}%`}}/></div>
          <span style={{fontSize:'10px',color:'var(--sub)'}}>0:{String(room.timer).padStart(2,'0')}</span>
        </div>
      </div>
      <div className="game-slot-area">
        <div className="slot-pointer" />
        <div className="slot-track">
          {room.players?.map((p: any, i: number) => (
            <div key={i} className="slot-item">
              <div className="slot-avatar" style={{background:p.color}}>{p.name?.substring(0,2).toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="game-actions">
        <input className="input" type="number" value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} min={1} />
        <button className="btn btn-primary btn-lg" onClick={placeBet}>→</button>
      </div>
      <div className="game-players">
        {room.players?.map((p: any, i: number) => (
          <div key={i} className="history-item"><span>{p.name}</span><span>{p.bet} ⭐</span></div>
        ))}
      </div>
      {room.lastWinner && (
        <div className="winner-info animate-fade-in">
          <div className="winner-name">{room.lastWinner.name}</div>
          <div className="winner-amount">+{room.lastWinner.amount.toLocaleString()} ⭐</div>
        </div>
      )}
    </div>
  );
}
