import { useState } from 'react';

export default function AdminPage() {
  const [tab, setTab] = useState('logs');
  const tabs = ['logs','users','requests','bots','requisites','broadcast'];

  return (
    <div className="card" style={{marginTop:'var(--space-4)'}}>
      <h3 className="card-title" style={{textAlign:'center'}}>🔧 Админ</h3>
      <div className="rooms-bar">
        {tabs.map(t => (
          <button key={t} className={`room-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div style={{marginTop:12,color:'var(--color-text-muted)',textAlign:'center'}}>Раздел &laquo;{tab}&raquo;</div>
    </div>
  );
}
