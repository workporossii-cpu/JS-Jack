import { useState } from 'react';

interface WithdrawModalProps {
  onClose: () => void;
  onSubmit: (method: string, amount: number, wallet: string) => void;
}

export function WithdrawModal({ onClose, onSubmit }: WithdrawModalProps) {
  const [method, setMethod] = useState('sbp');
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 1500 || !wallet.trim()) return;
    onSubmit(method, amt, wallet);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Вывод средств</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <select className="select" value={method} onChange={(e) => setMethod(e.target.value)} style={{ marginBottom: 'var(--space-3)' }}>
          <option value="sbp">СБП</option>
          <option value="card">Банковская карта</option>
          <option value="usdt">USDT TRC-20</option>
          <option value="ton">TON</option>
        </select>

        <input
          className="input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Сумма (мин. 1500)"
          style={{ marginBottom: 'var(--space-3)' }}
        />

        <input
          className="input"
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder={method === 'sbp' ? '+79XXXXXXXXX' : method === 'card' ? '0000 0000 0000 0000' : 'Адрес кошелька'}
          style={{ marginBottom: 'var(--space-3)' }}
        />

        <button className="btn btn-primary btn-full" onClick={handleSubmit}>Вывести</button>
      </div>
    </div>
  );
}
