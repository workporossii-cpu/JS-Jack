import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';

interface GamePageProps {
  socket: Socket | null;
}

export function GamePage({ socket }: GamePageProps) {
  const { currentRoom, rooms, isSpinning, setRooms, setCurrentRoom, setSpinning, myBet, setMyBet, addWinner } = useGameStore();
  const { balance, setBalance, token } = useUserStore();

  const room = rooms[currentRoom] || { bank: 0, timer: 0, maxTimer: 30, players: [], lastWinner: null };

  useEffect(() => {
    if (!socket) return;
    socket.on('room_state', setRooms);
    socket.on('round_start', () => setSpinning(true));
    socket.on('round_end', ({ winner }: any) => {
      setSpinning(false);
      addWinner(winner);
    });
    socket.on('balance_update', ({ balance }: any) => setBalance(balance));
    return () => {
      socket.off('room_state');
      socket.off('round_start');
      socket.off('round_end');
      socket.off('balance_update');
    };
  }, [socket]);

  const placeBet = () => {
    if (!socket || isSpinning) return;
    const amount = 10; // Позже из инпута
    socket.emit('place_bet', { roomId: currentRoom, amount, token });
  };

  return (
    <div className="game-layout">
      <div className="game-header">
        <div className="rooms-bar">
          {Object.keys(rooms).map((id) => (
            <button
              key={id}
              className={`room-tab ${id === currentRoom ? 'active' : ''}`}
              onClick={() => setCurrentRoom(id)}
            >
              {id}
              <span className="room-tab-limits">1-50</span>
            </button>
          ))}
        </div>
        <div className="game-bank">{room.bank.toLocaleString()}</div>
        <div className="game-timer">
          <div className="game-timer-bar">
            <div className="game-timer-fill" style={{ width: `${(room.timer / room.maxTimer) * 100}%` }} />
          </div>
          <span>0:{String(room.timer).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="game-slot-area">
        <div className="roulette-container">
          <div className="roulette-pointer" />
          <div className="roulette-track">
            {room.players?.map((p: any, i: number) => (
              <div key={i} className="roulette-item">
                <div className="roulette-avatar" style={{ background: p.color }}>
                  {p.name?.substring(0, 2).toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="game-actions">
        <input className="input" type="number" placeholder="Сумма ставки" min={1} />
        <button className="btn btn-primary btn-lg" onClick={placeBet}>→</button>
      </div>

      <div className="game-players">
        {room.players?.map((p: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 'var(--text-sm)' }}>
            <span>{p.name}</span>
            <span>{p.bet} мон.</span>
          </div>
        ))}
      </div>

      {room.lastWinner && (
        <div className="roulette-winner-info">
          <div className="roulette-winner-name">{room.lastWinner.name}</div>
          <div className="roulette-winner-amount">+{room.lastWinner.amount.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
