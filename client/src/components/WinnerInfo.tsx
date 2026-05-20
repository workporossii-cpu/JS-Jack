interface Props { winner: { name: string; amount: number; ticket?: number } | null; visible: boolean }

export default function WinnerInfo({ winner, visible }: Props) {
  if (!visible || !winner) return null;
  return (
    <div className="roulette-winner-info animate-fade-in">
      <div className="roulette-winner-name">{winner.name}</div>
      {winner.ticket && <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>Билет: #{winner.ticket}</div>}
      <div className="roulette-winner-amount">+{winner.amount.toLocaleString()} ⭐</div>
    </div>
  );
}
