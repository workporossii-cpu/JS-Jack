import { useUserStore } from '../store/userStore';

export default function WalletPage() {
  const { balance } = useUserStore();
  return (
    <div className="wallet-page">
      <div className="wallet-balance-amount">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#f0b90b" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14l-6-4.5h7.5z"/>
        </svg>
        {balance.toLocaleString()}
      </div>
      <div className="wallet-balance-label">баланс в Stars</div>
      <div className="wallet-actions">
        <button className="btn btn-primary btn-full">⭐ Пополнить</button>
        <button className="btn btn-secondary btn-full">Вывести</button>
      </div>
    </div>
  );
}
