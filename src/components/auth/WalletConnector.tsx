import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useBlockchainAuth } from '@/contexts/BlockchainAuthContext';
import { useToast } from '@/hooks/use-toast';

export const WalletConnector = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user: walletUser, connectWallet, logout: disconnectWallet } = useBlockchainAuth();
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been successfully connected for payments'
      });
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your wallet to make payments for insurance plans
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!walletUser?.address ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">No wallet connected</span>
            </div>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
            <p className="text-xs text-muted-foreground">
              You'll need MetaMask or another Web3 wallet to make payments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Wallet Connected</span>
              <Badge variant="outline" className="text-xs">Web3</Badge>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-mono text-green-800">
                {walletUser.address.slice(0, 6)}...{walletUser.address.slice(-4)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Ready for payments on Base Sepolia
              </p>
            </div>
            <Button 
              onClick={handleDisconnect} 
              variant="outline"
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};