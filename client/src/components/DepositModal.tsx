import { useState } from 'react';

interface DepositModalProps {
  onClose: () => void;
  onSubmit: (method: string, amount: number) => void;
}

export function DepositModal({ onClose, onSubmit }: DepositModalProps) {
  const [method, setMethod] = useState('sbp');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    onSubmit(method, amt);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Пополнение</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <select className="select" value={method} onChange={(e) => setMethod(e.target.value)} style={{ marginBottom: 'var(--space-3)' }}>
          <option value="sbp">СБП (от 1000₽)</option>
          <option value="card">Банковская карта (от 3000₽)</option>
          <option value="ton">TON (от 5 TON)</option>
          <option value="usdt">USDT TRC-20 (от 10$)</option>
        </select>

        <input
          className="input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Сумма пополнения"
          style={{ marginBottom: 'var(--space-3)' }}
        />

        <button className="btn btn-primary btn-full" onClick={handleSubmit}>Пополнить</button>
      </div>
    </div>
  );
}
