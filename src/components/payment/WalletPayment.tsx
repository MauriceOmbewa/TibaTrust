import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, CheckCircle, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBlockchainAuth } from '@/contexts/BlockchainAuthContext';
import { payPremiumForPlan, getWalletBalance } from '@/services/blockchain/contract';
import { formatEther, parseEther } from '@/services/blockchain/web3';
import { CurrencyService } from '@/services/currency';

interface InsurancePlan {
  id: number;
  name: string;
  price: string;
  coverage: string;
  features: string[];
}



const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: 1,
    name: 'Basic',
    price: '0.0005',
    coverage: '0.05',
    features: ['Basic medical coverage', 'Emergency care', 'Prescription drugs']
  },
  {
    id: 2,
    name: 'Standard',
    price: '0.001',
    coverage: '0.1',
    features: ['All Basic features', 'Specialist consultations', 'Diagnostic tests', 'Dental care']
  },
  {
    id: 3,
    name: 'Premium',
    price: '0.0025',
    coverage: '0.25',
    features: ['All Standard features', 'Surgery coverage', 'International treatment', 'Mental health']
  }
];

export const WalletPayment = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [showKSH, setShowKSH] = useState(false);
  const [ethToKshRate, setEthToKshRate] = useState<number>(400000);
  const { user } = useBlockchainAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch real-time conversion rate
    CurrencyService.getETHToKSHRate().then(rate => {
      setEthToKshRate(rate);
    });
  }, []);

  const formatPrice = (ethPrice: string) => {
    const eth = parseFloat(ethPrice);
    if (showKSH) {
      const ksh = eth * ethToKshRate;
      return `KSh ${ksh.toLocaleString()}`;
    }
    return `${ethPrice} ETH`;
  };

  const formatBalance = (ethBalance: string) => {
    const eth = parseFloat(ethBalance);
    if (showKSH) {
      const ksh = eth * ethToKshRate;
      return `KSh ${ksh.toLocaleString()}`;
    }
    return `${eth.toFixed(4)} ETH`;
  };

  const checkBalance = async () => {
    if (!user?.address) return;
    
    try {
      const balance = await getWalletBalance(user.address);
      setWalletBalance(balance);
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
    }
  };

  const handlePayment = async (planId: number, price: string) => {
    if (!user?.address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setSelectedPlan(planId);

    try {
      // Check wallet balance
      await checkBalance();
      const balance = parseFloat(walletBalance);
      const planPrice = parseFloat(price);

      if (balance < planPrice) {
        const needed = showKSH ? `KSh ${(planPrice * ethToKshRate).toLocaleString()}` : `${price} ETH`;
        const have = showKSH ? `KSh ${(balance * ethToKshRate).toLocaleString()}` : `${balance.toFixed(4)} ETH`;
        toast({
          title: 'Insufficient Balance',
          description: `You need ${needed} but only have ${have}`,
          variant: 'destructive'
        });
        return;
      }

      // Make payment
      const tx = await payPremiumForPlan(planId, price);
      
      toast({
        title: 'Payment Successful!',
        description: `Premium paid for ${INSURANCE_PLANS.find(p => p.id === planId)?.name} plan. Transaction: ${tx.hash}`,
      });

      // Refresh balance
      await checkBalance();

    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Transaction failed. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  // Check balance on component mount
  useState(() => {
    if (user?.address) {
      checkBalance();
    }
  });

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Address:</span>
              <span className="text-sm font-mono">{user?.address?.slice(0, 6)}...{user?.address?.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Balance:</span>
              <span className="text-sm font-semibold">{formatBalance(walletBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Network:</span>
              <Badge variant="outline">Base Sepolia</Badge>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={checkBalance} variant="outline" size="sm" className="flex-1">
              Refresh Balance
            </Button>
            <Button 
              onClick={() => setShowKSH(!showKSH)} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              {showKSH ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {showKSH ? 'KSH' : 'ETH'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INSURANCE_PLANS.map((plan) => {
          const canAfford = parseFloat(walletBalance) >= parseFloat(plan.price);
          const isProcessing = isLoading && selectedPlan === plan.id;

          return (
            <Card key={plan.id} className={`relative ${!canAfford ? 'opacity-60' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {canAfford ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  Monthly Premium: {formatPrice(plan.price)}
                  {showKSH && (
                    <span className="block text-xs text-muted-foreground mt-1">
                      ({plan.price} ETH)
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coverage Limit:</p>
                  <p className="font-semibold">{formatPrice(plan.coverage)}</p>
                  {showKSH && (
                    <p className="text-xs text-muted-foreground">({plan.coverage} ETH)</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Features:</p>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handlePayment(plan.id, plan.price)}
                  disabled={!canAfford || isLoading}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay {formatPrice(plan.price)}
                    </>
                  )}
                </Button>

                {!canAfford && (
                  <p className="text-xs text-red-500 text-center">
                    Insufficient balance
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Payment Recipient:</strong> 0xc3acc6de63F3Fb2D5a41D56320509e764a0B31fA</p>
            <p><strong>Network:</strong> Base Sepolia Testnet</p>
            <p><strong>Payment Method:</strong> Direct wallet transfer via smart contract</p>
            <p><strong>Exchange Rate:</strong> 1 ETH ≈ KSh {ethToKshRate.toLocaleString()}</p>
            <p className="text-muted-foreground">
              Payments are processed instantly and sent directly to the insurance provider's wallet.
              Exchange rates are updated every 5 minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};