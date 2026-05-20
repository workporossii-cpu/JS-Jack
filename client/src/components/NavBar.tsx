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
    <nav className="app-nav">
      {items.map(item => (
        <button key={item.id} className={`app-nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => item.action ? item.action() : onNavigate(item.id)}>
          <span>{item.icon}</span>
          <span>{item.label}</span>
          {item.id === 'wallet' && <span className="balance-bubble">⭐ {balance}</span>}
        </button>
      ))}
    </nav>
  );
}
