import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateLoginForm, validateRegistrationForm, validateContactForm, ValidationError } from '@/utils/validation';
import { useAuth } from './FirebaseAuthContext';
import { useBlockchainAuth } from './BlockchainAuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plan?: string;
  isLoggedIn: boolean;
  uid?: string;
  tokens?: number;
  coverageStatus?: string;
  memberSince?: string;
  firebaseUid?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  submitContactForm: (formData: any) => Promise<boolean>;
  submitDonation: (donationData: any) => Promise<boolean>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser, login: firebaseLogin, register: firebaseRegister, logout: firebaseLogout } = useAuth();
  const { logout: blockchainLogout } = useBlockchainAuth();

  const login = async (email: string, password: string): Promise<boolean> => {
    const validationErrors = validateLoginForm(email, password);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors[0].message,
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const success = await firebaseLogin(email, password);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    const validationErrors = validateRegistrationForm(userData);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors[0].message,
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const displayName = `${userData.firstName} ${userData.lastName}`;
      const success = await firebaseRegister(userData.email, userData.password, displayName);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
    localStorage.removeItem('user');
    
    // Also disconnect blockchain wallet
    blockchainLogout();
  };

  const submitContactForm = async (formData: any): Promise<boolean> => {
    const validationErrors = validateContactForm(formData);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors[0].message,
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to Send Message",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const submitDonation = async (donationData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Donation Successful",
        description: `Thank you for your donation of KSh ${donationData.amount}. Your contribution will help save lives.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "Please check your payment details and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const appUser: User = {
        id: currentUser.uid,
        firstName: currentUser.displayName?.split(' ')[0] || 'User',
        lastName: currentUser.displayName?.split(' ')[1] || '',
        email: currentUser.email || '',
        phone: '+254700123456',
        plan: 'Standard',
        isLoggedIn: true,
        uid: 'UID' + currentUser.uid.slice(-6),
        tokens: 2500,
        coverageStatus: 'Active',
        memberSince: '2024-01-01',
        firebaseUid: currentUser.uid
      };
      setUser(appUser);
      localStorage.setItem('user', JSON.stringify(appUser));
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  const value: AppContextType = {
    user,
    setUser,
    login,
    register,
    logout,
    submitContactForm,
    submitDonation,
    isLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};