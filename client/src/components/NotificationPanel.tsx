import { useEffect, useState } from 'react';

interface Notification {
  text: string;
  time: string;
}

interface NotificationPanelProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationPanel({ visible, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { text: 'Добро пожаловать в SJ CASINO!', time: new Date().toLocaleTimeString() },
  ]);

  useEffect(() => {
    // Подписка на уведомления через сокет (добавим позже)
  }, []);

  if (!visible) return null;

  return (
    <div className="chat-panel open" style={{ right: 0 }}>
      <div className="chat-header">
        <span className="chat-title">Уведомления</span>
        <button className="chat-close" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages">
        {notifications.map((n, i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <div style={{ fontSize: 'var(--text-sm)' }}>{n.text}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
