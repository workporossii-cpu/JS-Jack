interface Props { transactions: any[] }

export default function TransactionsList({ transactions }: Props) {
  if (!transactions.length) return <p style={{textAlign:'center',color:'var(--color-text-muted)'}}>Нет транзакций</p>;
  return (
    <div>
      {transactions.map((tx, i) => (
        <div key={i} className="wallet-tx-item">
          <span className="wallet-tx-type">{tx.type}</span>
          <span>{tx.amount.toLocaleString()} ⭐</span>
          <span className={`wallet-tx-status ${tx.status}`}>{tx.status}</span>
        </div>
      ))}
    </div>
  );
}
