import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { connectWallet, getContract, parseEther, CONTRACT_ADDRESS } from '@/services/blockchain/web3';
import { getTokenBalance } from '@/services/blockchain/contract';

export const BlockchainTest = () => {
  const [wallet, setWallet] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');

  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      const address = await connectWallet();
      setWallet(address);
      
      // Get user info - commented out to fix ENS error
      // const info = await getUserInfo(address);
      // setUserInfo(info);
      
      // Get token balance
      const balance = await getTokenBalance(address);
      setTokenBalance(balance);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestDonation = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.donate({ value: parseEther('0.001') });
      await tx.wait();
      alert('Donation successful!');
      
      // Refresh balance
      const balance = await getTokenBalance(wallet);
      setTokenBalance(balance);
    } catch (error) {
      console.error('Donation failed:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('Contract not deployed')) {
        alert('⚠️ Smart contract not deployed yet.\n\nTo test blockchain features:\n1. Deploy contract to Base Sepolia\n2. Update VITE_CONTRACT_ADDRESS in .env');
      } else {
        alert('Donation failed: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🔗 Blockchain Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet ? (
          <Button onClick={handleConnectWallet} disabled={loading} className="w-full">
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Wallet:</p>
              <p className="text-xs text-muted-foreground">{wallet}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">TTT Balance:</p>
              <p className="text-lg font-bold">{parseFloat(tokenBalance).toFixed(2)} TTT</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Contract Status:</p>
              <p className={`text-sm ${CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' ? 'text-green-600' : 'text-orange-600'}`}>
                {CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' ? '✅ Deployed' : '⚠️ Not Deployed'}
              </p>
            </div>
            
            {userInfo && (
              <div>
                <p className="text-sm font-medium">Plan ID:</p>
                <p>{userInfo.planId || 'Not registered'}</p>
              </div>
            )}
            
            <Button onClick={handleTestDonation} disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Test Donation (0.001 ETH)'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};