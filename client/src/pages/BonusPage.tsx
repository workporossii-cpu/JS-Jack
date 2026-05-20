import { useState } from 'react';

export default function BonusPage() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const activate = () => {
    setMsg('Промокод активирован! +10 ⭐');
    setCode('');
  };

  return (
    <div style={{ background: '#1a1d25', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
      <h3 style={{ textAlign: 'center', color: '#a970ff', marginBottom: '12px' }}>🎁 Бонус</h3>
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Промокод"
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #252830', background: '#0f1117', color: '#fff', fontSize: '14px', textAlign: 'center', marginBottom: '8px', outline: 'none' }}
      />
      <button
        onClick={activate}
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
      >Активировать</button>
      {msg && <p style={{ textAlign: 'center', marginTop: '8px', color: '#4ade80' }}>{msg}</p>}
    </div>
  );
}
