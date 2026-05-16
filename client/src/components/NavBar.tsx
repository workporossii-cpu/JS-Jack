interface NavBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onChat: () => void;
}

export function NavBar({ currentPage, onNavigate, onChat }: NavBarProps) {
  const balance = 0; // Позже подключим userStore

  const items = [
    { id: 'jackpot', label: 'Игра', icon: '🎰' },
    { id: 'bonus', label: 'Бонус', icon: '🎁' },
    { id: 'wallet', label: 'Кошелёк', icon: '💰' },
    { id: 'chat', label: 'Чат', icon: '💬', action: onChat },
    { id: 'profile', label: 'Профиль', icon: '👤' },
  ];

  return (
    <nav className="app-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`app-nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => item.action ? item.action() : onNavigate(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
          {item.id === 'wallet' && (
            <span style={{
              position: 'absolute',
              top: -20,
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-accent-primary)',
              borderRadius: 'var(--radius-pill)',
              padding: '2px 8px',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-gold)',
            }}>
              {balance.toLocaleString()}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
