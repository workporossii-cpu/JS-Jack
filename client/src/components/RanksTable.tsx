const RANKS = [
  { name: 'Новичок', bets: 0, dep: 0, bonus: 0 },
  { name: 'Любитель', bets: 1000, dep: 500, bonus: 50 },
  { name: 'Игрок', bets: 5000, dep: 1500, bonus: 100 },
  { name: 'Хайроллер', bets: 15000, dep: 5000, bonus: 300 },
  { name: 'Элита', bets: 50000, dep: 15000, bonus: 800 },
  { name: 'Легенда', bets: 150000, dep: 50000, bonus: 1500 },
  { name: 'Король', bets: 500000, dep: 150000, bonus: 3000 },
  { name: 'Бог', bets: 1500000, dep: 500000, bonus: 10000 },
];

interface Props { currentRankIndex: number }

export default function RanksTable({ currentRankIndex }: Props) {
  return (
    <div className="card" style={{marginTop:'var(--space-4)'}}>
      <h3 className="card-title" style={{textAlign:'center'}}>🏅 Таблица рангов</h3>
      {RANKS.map((r, i) => (
        <div key={r.name} style={{padding:'var(--space-2)',borderBottom:'1px solid var(--color-border-secondary)',background:i===currentRankIndex?'rgba(var(--color-accent-rgb),0.1)':'transparent',borderRadius:i===currentRankIndex?'var(--radius-md)':0}}>
          <strong>{r.name}</strong>
          <span style={{marginLeft:8,fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Ставок: {r.bets.toLocaleString()} / Деп: {r.dep.toLocaleString()}</span>
          <span style={{marginLeft:8,color:'var(--color-gold)',fontWeight:'var(--font-semibold)'}}>+{r.bonus.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
