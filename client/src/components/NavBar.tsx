interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  onChat: () => void;
  balance: number;
}

export default function NavBar({ currentPage, onNavigate, onChat, balance }: Props) {
  const items = [
    { id: 'jackpot', label: 'Игра', icon: '🎰' },
    { id: 'bonus', label: 'Бонус', icon: '🎁' },
    { id: 'wallet', label: 'Кошелёк', icon: '💰' },
    { id: 'chat', label: 'Чат', icon: '💬', action: onChat },
    { id: 'profile', label: 'Профиль', icon: '👤' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '420px',
      background: '#0d0d16',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 6px 20px',
      borderTop: '1px solid #252830',
      zIndex: 100
    }}>
      {items.map(item => (
        <button key={item.id}
          onClick={() => item.action ? item.action() : onNavigate(item.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            fontSize: '8px',
            color: currentPage === item.id ? '#a970ff' : '#5a5a6e',
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative'
          }}>
          <span>{item.icon}</span>
          <span>{item.label}</span>
          {item.id === 'wallet' && (
            <span style={{
              position: 'absolute',
              top: '-28px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1a1d25',
              border: '1px solid #a970ff',
              borderRadius: '8px 8px 0 0',
              padding: '4px 10px',
              fontSize: '10px',
              fontWeight: 600,
              color: '#f0b90b',
              whiteSpace: 'nowrap'
            }}>⭐ {balance}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
