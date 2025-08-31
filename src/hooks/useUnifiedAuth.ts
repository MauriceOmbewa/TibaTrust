import { useApp } from '@/contexts/AppContext';
import { useBlockchainAuth } from '@/contexts/BlockchainAuthContext';

export const useUnifiedAuth = () => {
  const { user: firebaseUser, isLoading: firebaseLoading } = useApp();
  
  // Safely handle blockchain auth with fallback
  let blockchainUser = null;
  let blockchainAuth = false;
  let blockchainLoading = false;
  
  try {
    const blockchainAuthData = useBlockchainAuth();
    blockchainUser = blockchainAuthData.user;
    blockchainAuth = blockchainAuthData.isAuthenticated;
    blockchainLoading = blockchainAuthData.isLoading;
  } catch (error) {
    console.warn('Blockchain auth not available:', error);
  }

  const isAuthenticated = firebaseUser?.isLoggedIn || blockchainAuth;
  const isLoading = firebaseLoading || blockchainLoading;
  
  const currentUser = firebaseUser?.isLoggedIn ? {
    type: 'firebase' as const,
    data: firebaseUser,
    address: null
  } : blockchainAuth ? {
    type: 'blockchain' as const,
    data: blockchainUser,
    address: blockchainUser?.address
  } : null;

  return {
    isAuthenticated,
    isLoading,
    currentUser,
    authType: currentUser?.type || null
  };
};