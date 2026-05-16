interface WinnerInfoProps {
  winner: {
    name: string;
    amount: number;
    ticket?: number;
    chance?: string;
  } | null;
  visible: boolean;
}

export function WinnerInfo({ winner, visible }: WinnerInfoProps) {
  if (!visible || !winner) return null;

  return (
    <div className="roulette-winner-info animate-fade-in">
      <div className="roulette-winner-name">{winner.name}</div>
      <div className="roulette-winner-chance">
        {winner.chance && `Шанс: ${winner.chance}%`}
        {winner.ticket && ` | Билет: #${winner.ticket}`}
      </div>
      <div className="roulette-winner-amount">+{winner.amount.toLocaleString()} мон.</div>
    </div>
  );
}
