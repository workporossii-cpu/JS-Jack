import { useState } from 'react';

interface Props { onClose: () => void }

export default function DepositModal({ onClose }: Props) {
  const [method, setMethod] = useState('stars');
  const [amount, setAmount] = useState('');

  const handle = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    if (method === 'stars') {
      fetch('/api/stars/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ amount: amt })
      }).then(r => r.json()).then(data => {
        if (data.invoiceLink && window.Telegram?.WebApp?.openInvoice) {
          window.Telegram.WebApp.openInvoice(data.invoiceLink, (status: string) => {
            if (status === 'paid') { alert('✅ Пополнено на ' + amt + ' ⭐'); onClose(); }
          });
        }
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><span className="modal-title">Пополнение ⭐</span><button className="modal-close" onClick={onClose}>×</button></div>
        <select className="select" value={method} onChange={e => setMethod(e.target.value)} style={{marginBottom:12}}>
          <option value="stars">Telegram Stars</option>
          <option value="sbp">СБП</option>
          <option value="card">Карта</option>
          <option value="ton">TON</option>
          <option value="usdt">USDT</option>
        </select>
        <input className="input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Сумма" style={{marginBottom:12}} />
        <button className="btn btn-primary btn-full" onClick={handle}>Пополнить</button>
      </div>
    </div>
  );
}
