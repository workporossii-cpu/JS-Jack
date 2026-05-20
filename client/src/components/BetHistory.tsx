interface Props { bets: any[] }

export default function BetHistory({ bets }: Props) {
  if (!bets.length) return <p style={{ textAlign: 'center', color: 'var(--sub)', fontSize: '12px' }}>Пока нет истории ставок</p>;

  return (
    <div className="card" style={{ marginTop: '16px' }}>
      <h3 className="card-title" style={{ textAlign: 'center' }}>📋 История ставок</h3>
      {bets.slice(0, 20).map((bet: any, i: number) => (
        <div key={i} className={`history-item ${bet.win ? 'win' : 'lose'}`}>
          <span style={{ color: 'var(--sub)' }}>{bet.room_id || 'Комната'}</span>
          <span>{bet.amount} ⭐</span>
          <span style={{ color: bet.win ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
            {bet.win ? 'Выигрыш' : 'Проигрыш'}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--sub)' }}>Билет #{bet.ticket || 0}</span>
        </div>
      ))}
    </div>
  );
}
