import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface Transaction {
  hash: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed';
}

export const TransactionMonitor = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (hash: string, amount: string) => {
    const newTx: Transaction = {
      hash,
      amount,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    setTransactions(prev => [newTx, ...prev.slice(0, 4)]); // Keep last 5 transactions
    
    // Simulate confirmation after 30 seconds
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.hash === hash ? { ...tx, status: 'confirmed' } : tx
        )
      );
    }, 30000);
  };

  // Listen for payment events (this would be connected to your contract events)
  useEffect(() => {
    // This is a placeholder - in real implementation, you'd listen to contract events
    const handlePaymentEvent = (event: any) => {
      addTransaction(event.transactionHash, event.returnValues.amount);
    };

    // You would set up event listeners here
    return () => {
      // Cleanup listeners
    };
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getExplorerUrl = (hash: string) => {
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          Monitor payments to 0xc3acc6de63F3Fb2D5a41D56320509e764a0B31fA
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent transactions
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.hash} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                      {tx.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </Badge>
                    <span className="text-sm font-medium">{tx.amount} ETH</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(tx.timestamp)}
                  </p>
                </div>
                <a
                  href={getExplorerUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};