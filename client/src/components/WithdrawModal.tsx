import { useState } from 'react';

interface Props { onClose: () => void }

export default function WithdrawModal({ onClose }: Props) {
  const [method, setMethod] = useState('sbp');
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');

  const handle = () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 1500 || !wallet.trim()) return;
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><span className="modal-title">Вывод</span><button className="modal-close" onClick={onClose}>×</button></div>
        <select className="select" value={method} onChange={e => setMethod(e.target.value)} style={{marginBottom:12}}>
          <option value="sbp">СБП</option><option value="card">Карта</option><option value="usdt">USDT</option><option value="ton">TON</option>
        </select>
        <input className="input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Сумма (мин 1500 ⭐)" style={{marginBottom:12}} />
        <input className="input" type="text" value={wallet} onChange={e => setWallet(e.target.value)} placeholder={method === 'sbp' ? '+79XXXXXXXXX' : 'Адрес'} style={{marginBottom:12}} />
        <button className="btn btn-primary btn-full" onClick={handle}>Вывести</button>
      </div>
    </div>
  );
}
