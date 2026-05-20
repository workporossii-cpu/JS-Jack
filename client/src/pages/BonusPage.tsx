import { useState } from 'react';

export default function BonusPage() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const activate = () => {
    setMsg('Промокод активирован! +10 ⭐');
    setCode('');
  };

  return (
    <div className="card" style={{marginTop:'var(--space-4)'}}>
      <h3 className="card-title" style={{textAlign:'center'}}>🎁 Бонус</h3>
      <input className="input" type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Промокод" />
      <button className="btn btn-primary btn-full" style={{marginTop:8}} onClick={activate}>Активировать</button>
      {msg && <p style={{textAlign:'center',marginTop:8,color:'var(--color-green)'}}>{msg}</p>}
    </div>
  );
}
