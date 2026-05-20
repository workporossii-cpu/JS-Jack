import { useUserStore } from '../store/userStore';
import BetHistory from '../components/BetHistory';

interface Props { betHistory: any[] }

export default function ProfilePage({ betHistory }: Props) {
  const { username, balance, totalBets, totalDeposit } = useUserStore();
  return (
    <div className="profile-page">
      <div className="profile-avatar">{username.substring(0,2).toUpperCase()}</div>
      <div className="profile-nick">{username}</div>
      <div className="profile-stats">
        <div className="profile-stat-row">
          <span className="profile-stat-label">Баланс</span>
          <span className="profile-stat-value">⭐ {balance.toLocaleString()}</span>
        </div>
        <div className="profile-stat-row">
          <span className="profile-stat-label">Всего ставок</span>
          <span className="profile-stat-value">{totalBets}</span>
        </div>
        <div className="profile-stat-row">
          <span className="profile-stat-label">Депозит</span>
          <span className="profile-stat-value">⭐ {totalDeposit.toLocaleString()}</span>
        </div>
      </div>
      <BetHistory bets={betHistory} />
    </div>
  );
}
