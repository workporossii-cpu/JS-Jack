interface Props { visible: boolean; onClose: () => void }

export default function NotificationPanel({ visible, onClose }: Props) {
  if (!visible) return null;
  return (
    <div className="chat-panel open" style={{right:0}}>
      <div className="chat-header"><span className="chat-title">Уведомления</span><button className="chat-close" onClick={onClose}>×</button></div>
      <div className="chat-messages">
        <div className="card" style={{padding:'var(--space-2)'}}>Добро пожаловать в SJ CASINO ⭐</div>
      </div>
    </div>
  );
}
