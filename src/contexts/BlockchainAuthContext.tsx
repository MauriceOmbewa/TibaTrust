import React, { createContext, useContext, useEffect, useState } from 'react';
import { BlockchainAuth, BlockchainUser } from '@/services/blockchain/auth';
import { getUserInfo } from '@/services/blockchain/contract';
import { useToast } from '@/hooks/use-toast';

interface BlockchainAuthContextType {
  user: BlockchainUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<boolean>;
  logout: () => void;
  userInfo: any;
}

const BlockchainAuthContext = createContext<BlockchainAuthContextType | undefined>(undefined);

export const useBlockchainAuth = () => {
  const context = useContext(BlockchainAuthContext);
  if (!context) {
    throw new Error('useBlockchainAuth must be used within BlockchainAuthProvider');
  }
  return context;
};

export const BlockchainAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BlockchainUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const { toast } = useToast();

  const login = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authenticatedUser = await BlockchainAuth.authenticateWithWallet();
      setUser(authenticatedUser);
      
      // Get user info from contract
      try {
        const info = await getUserInfo(authenticatedUser.address);
        setUserInfo(info);
      } catch (error) {
        console.log('User not registered on contract yet:', error);
        // Continue without contract info - user can still use basic features
      }
      
      toast({
        title: 'Success',
        description: 'Wallet connected and authenticated!'
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Authentication Failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    BlockchainAuth.logout();
    setUser(null);
    setUserInfo(null);
    toast({
      title: 'Logged Out',
      description: 'Wallet disconnected successfully'
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        const storedUser = BlockchainAuth.getStoredAuth();
        if (storedUser) {
          const isValid = await BlockchainAuth.verifyStoredAuth();
          if (isValid) {
            setUser(storedUser);
            
            // Get user info from contract
            try {
              const info = await getUserInfo(storedUser.address);
              setUserInfo(info);
            } catch (error) {
              console.log('User not registered on contract yet');
            }
          } else {
            BlockchainAuth.logout();
          }
        }
      } catch (error) {
        console.error('Failed to initialize blockchain auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: BlockchainAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    userInfo
  };

  return (
    <BlockchainAuthContext.Provider value={value}>
      {children}
    </BlockchainAuthContext.Provider>
  );
};