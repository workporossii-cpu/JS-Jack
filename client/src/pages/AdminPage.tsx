import { useState, useEffect } from 'react';
import type { Socket } from 'socket.io-client';

interface AdminPageProps {
  socket: Socket | null;
}

export function AdminPage({ socket }: AdminPageProps) {
  const [tab, setTab] = useState('logs');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);

  useEffect(() => {
    if (tab === 'logs') fetch('/api/admin/transactions').then(r => r.json()).then(setTransactions);
    if (tab === 'bots') fetch('/api/admin/bots').then(r => r.json()).then(setBots);
  }, [tab]);

  const tabs = [
    { id: 'logs', label: 'Логи' },
    { id: 'users', label: 'Юзеры' },
    { id: 'requests', label: 'Заявки' },
    { id: 'bots', label: 'Боты' },
    { id: 'requisites', label: 'Реквизиты' },
    { id: 'broadcast', label: 'Рассылка' },
  ];

  return (
    <div className="card" style={{ marginTop: 'var(--space-4)' }}>
      <h3 className="card-title" style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>🔧 Админ-панель</h3>

      <div className="rooms-bar" style={{ marginBottom: 'var(--space-3)' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`room-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'logs' && (
        <div>
          {transactions.slice(0, 20).map((tx: any) => (
            <div key={tx.id} className="wallet-tx-item">
              <span className="wallet-tx-type">{tx.type} #{tx.id}</span>
              <span>{tx.amount} мон.</span>
              <span className={`wallet-tx-status ${tx.status}`}>{tx.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'bots' && (
        <div>
          {bots.map((bot: any) => (
            <div key={bot.id} className="wallet-tx-item">
              <span>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: bot.color, marginRight: 8 }} />
                {bot.name}
              </span>
              <span>{bot.min_bet}-{bot.max_bet} мон.</span>
              <span>{bot.rooms?.join(', ')}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Управление пользователями</p>}
      {tab === 'requests' && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Заявки на пополнение/вывод</p>}
      {tab === 'requisites' && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Реквизиты для пополнения</p>}
      {tab === 'broadcast' && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Рассылка сообщений</p>}
    </div>
  );
}
