import { useUserStore } from '../store/userStore';

export default function ProfilePage() {
  const { username, balance, totalBets, totalDeposit } = useUserStore();
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#b8a9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 600, color: '#fff', margin: '0 auto' }}>
        {username.substring(0,2).toUpperCase()}
      </div>
      <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '8px' }}>{username}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#1a1d25', borderRadius: '8px' }}>
          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Баланс</span>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>⭐ {balance.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#1a1d25', borderRadius: '8px' }}>
          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Всего ставок</span>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>{totalBets}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#1a1d25', borderRadius: '8px' }}>
          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Депозит</span>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>⭐ {totalDeposit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
