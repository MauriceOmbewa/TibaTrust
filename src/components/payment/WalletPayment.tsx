import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBlockchainAuth } from '@/contexts/BlockchainAuthContext';
import { payPremiumForPlan, getWalletBalance } from '@/services/blockchain/contract';
import { formatEther, parseEther } from '@/services/blockchain/web3';

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
  const { user } = useBlockchainAuth();
  const { toast } = useToast();

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
        toast({
          title: 'Insufficient Balance',
          description: `You need ${price} ETH but only have ${parseFloat(walletBalance).toFixed(4)} ETH`,
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
              <span className="text-sm font-semibold">{parseFloat(walletBalance).toFixed(4)} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Network:</span>
              <Badge variant="outline">Base Sepolia</Badge>
            </div>
          </div>
          <Button onClick={checkBalance} variant="outline" size="sm" className="w-full mt-4">
            Refresh Balance
          </Button>
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
                  Monthly Premium: {plan.price} ETH
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coverage Limit:</p>
                  <p className="font-semibold">{plan.coverage} ETH</p>
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
                      Pay {plan.price} ETH
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
            <p className="text-muted-foreground">
              Payments are processed instantly and sent directly to the insurance provider's wallet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};