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
      socket.off('room_state');
      socket.off('round_start');
      socket.off('round_end');
      socket.off('balance_update');
    };
  }, [socket, currentRoom]);

  const placeBet = () => {
    if (isSpinning || betAmount < 1) return;
    socket?.emit('place_bet', { roomId: currentRoom, amount: betAmount, token: localStorage.getItem('token') || 'demo' });
    setMyBet(myBet + betAmount);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {Object.keys(rooms).map((id) => (
          <button key={id} onClick={() => setCurrentRoom(id)}
            style={{
              flex: 1, padding: '10px 4px', borderRadius: '8px', border: '1px solid #252830',
              background: id === currentRoom ? 'rgba(169,112,255,0.1)' : '#111318',
              color: id === currentRoom ? '#a970ff' : '#71717a', fontSize: '9px', textTransform: 'uppercase'
            }}>
            {{bomj:'Бомж',classic:'Классик',major:'Мажор',hyena:'Гиена'}[id]}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#f0b90b' }}>⭐ {room.bank.toLocaleString()}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ flex: 1, height: '4px', background: '#111318', borderRadius: '4px' }}>
            <div style={{ height: '100%', background: '#8b5cf6', borderRadius: '4px', width: `${(room.timer/room.maxTimer)*100}%` }} />
          </div>
          <span style={{ fontSize: '10px', color: '#71717a' }}>0:{String(room.timer).padStart(2,'0')}</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: '80px', background: '#0f1117', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(169,112,255,0.5)' }} />
        <div style={{ display: 'flex', position: 'absolute', left: 0, top: '8px' }}>
          {room.players?.map((p: any, i: number) => (
            <div key={i} style={{ width: '38px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: '#fff' }}>
                {p.name?.substring(0,2).toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="number" value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} min={1}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #252830', background: '#0f1117', color: '#fff', fontSize: '14px', textAlign: 'center', outline: 'none' }} />
        <button onClick={placeBet} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>→</button>
      </div>
      <div style={{ background: '#1a1d25', borderRadius: '10px', padding: '12px', maxHeight: '140px', overflowY: 'auto' }}>
        {room.players?.map((p: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '9px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span>{p.name}</span><span>{p.bet} ⭐</span>
          </div>
        ))}
      </div>
      {room.lastWinner && (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{room.lastWinner.name}</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0b90b' }}>+{room.lastWinner.amount.toLocaleString()} ⭐</div>
        </div>
      )}
    </div>
  );
}
