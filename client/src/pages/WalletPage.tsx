import { useUserStore } from '../store/userStore';

export default function WalletPage() {
  const { balance } = useUserStore();
  return (
    <div className="wallet-page">
      <div className="wallet-balance">
        <div className="wallet-balance-amount">⭐ {balance.toLocaleString()}</div>
        <div className="wallet-balance-label">баланс в Stars</div>
      </div>
      <div className="wallet-actions">
        <button className="btn btn-primary btn-full">⭐ Пополнить</button>
        <button className="btn btn-secondary btn-full">Вывести</button>
      </div>
    </div>
  );
}
