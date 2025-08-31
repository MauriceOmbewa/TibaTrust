import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { useBlockchainAuth } from '@/contexts/BlockchainAuthContext';
import { useEffect, useState } from 'react';

const BlockchainLogin = () => {
  const { login, isLoading, isAuthenticated } = useBlockchainAuth();
  const [isWeb3Available, setIsWeb3Available] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check if Web3 is available
    if (typeof window !== 'undefined') {
      setIsWeb3Available(!!window.ethereum);
    }
  }, []);

  const handleWalletConnect = async () => {
    if (!isWeb3Available) {
      return;
    }
    await login();
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
      
      <div className="w-full max-w-md space-y-8 relative">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-highlight rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">TibaTrust</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-primary-foreground">
            Connect Your Wallet
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Secure blockchain authentication with your Web3 wallet
          </p>
        </div>
        
        {/* Wallet Connect */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-card border border-white/20">
          <div className="space-y-6">
            <div className="text-center">
              <Wallet className="w-16 h-16 text-highlight mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                Web3 Authentication
              </h3>
              <p className="text-sm text-primary-foreground/80 mb-6">
                Connect your MetaMask or compatible wallet to access your healthcare account securely on the blockchain.
              </p>
            </div>
            
            {!isWeb3Available ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-yellow-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-primary-foreground">Web3 wallet not detected</span>
                </div>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Install MetaMask
                  </Button>
                </a>
              </div>
            ) : (
              <Button 
                onClick={handleWalletConnect}
                className="w-full bg-white text-primary hover:bg-highlight hover:text-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
            
            <div className="text-xs text-primary-foreground/60 text-center">
              <p>Supported wallets: MetaMask, WalletConnect, Coinbase Wallet</p>
              <p className="mt-1">Network: Base Mainnet</p>
            </div>
          </div>
        </div>
        
        {/* Traditional Login Link */}
        <div className="text-center">
          <p className="text-sm text-primary-foreground/80">
            Prefer traditional login?{' '}
            <Link to="/login" className="font-medium text-highlight hover:text-highlight/80">
              Use email & password
            </Link>
          </p>
        </div>
        
        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlockchainLogin;