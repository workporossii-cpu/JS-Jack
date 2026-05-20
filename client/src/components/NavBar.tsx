interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  onChat: () => void;
  balance: number;
}

export default function NavBar({ currentPage, onNavigate, onChat, balance }: Props) {
  const items = [
    { id: 'jackpot', label: 'Игра', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentPage === 'jackpot' ? '#a970ff' : '#5a5a6e'} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 2v20"/>
      </svg>
    )},
    { id: 'bonus', label: 'Бонус', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentPage === 'bonus' ? '#a970ff' : '#5a5a6e'} strokeWidth="2">
        <path d="M20 12v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8"/><path d="M12 2v18"/><path d="M4 8l8-6 8 6"/>
      </svg>
    )},
    { id: 'wallet', label: 'Кошелёк', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentPage === 'wallet' ? '#a970ff' : '#5a5a6e'} strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="3"/><circle cx="12" cy="12" r="4"/><line x1="2" y1="7" x2="22" y2="7"/>
      </svg>
    )},
    { id: 'chat', label: 'Чат', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={chatOpen ? '#a970ff' : '#5a5a6e'} strokeWidth="2">
        <path d="M4 4h16v10H8l-4 4z"/>
      </svg>
    ), action: onChat },
    { id: 'profile', label: 'Профиль', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentPage === 'profile' ? '#a970ff' : '#5a5a6e'} strokeWidth="2">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/>
      </svg>
    )},
  ];

  return (
    <nav className="app-nav">
      {items.map(item => (
        <button key={item.id}
          className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => item.action ? item.action() : onNavigate(item.id)}>
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
          {item.id === 'wallet' && (
            <span className="balance-bubble">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#f0b90b"><path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14l-6-4.5h7.5z"/></svg>
              {' '}{balance.toLocaleString()}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
