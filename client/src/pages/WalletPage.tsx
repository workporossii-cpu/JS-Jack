import { useUserStore } from '../store/userStore';

export default function WalletPage() {
  const { balance } = useUserStore();
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '30px', fontWeight: 700, color: '#f0b90b' }}>⭐ {balance.toLocaleString()}</div>
        <div style={{ fontSize: '12px', color: '#71717a' }}>баланс в Stars</div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>⭐ Пополнить</button>
        <button style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #252830', background: 'transparent', color: '#a970ff', fontWeight: 600, cursor: 'pointer' }}>Вывести</button>
      </div>
    </div>
  );
}
