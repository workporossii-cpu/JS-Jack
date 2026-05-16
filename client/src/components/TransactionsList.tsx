interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  created_at?: string;
  fee?: number;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (!transactions.length) {
    return <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Пока нет транзакций</p>;
  }

  return (
    <div>
      {transactions.map((tx) => (
        <div key={tx.id} className="wallet-tx-item">
          <div>
            <span className="wallet-tx-type">{tx.type} #{tx.id}</span>
            <div className="wallet-tx-date">{tx.created_at ? new Date(tx.created_at).toLocaleString('ru-RU') : ''}</div>
          </div>
          <div>
            <div className="wallet-tx-amount">{tx.amount.toLocaleString()} мон.</div>
            <span className={`wallet-tx-status ${tx.status}`}>{tx.status}</span>
          </div>
          {tx.fee && <div className="wallet-tx-date">Комиссия: {tx.fee} мон.</div>}
        </div>
      ))}
    </div>
  );
}
