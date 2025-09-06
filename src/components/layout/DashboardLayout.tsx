import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, BarChart3, CreditCard, Users, Coins, User, LogOut } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useApp } from '@/contexts/AppContext';
import { useBlockchainAuth } from '@/contexts/BlockchainAuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout = ({ children, activeTab, onTabChange }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { currentUser, authType } = useUnifiedAuth();
  const { logout: firebaseLogout } = useApp();
  const { logout: blockchainLogout } = useBlockchainAuth();

  const handleLogout = () => {
    if (authType === 'blockchain') {
      blockchainLogout();
    } else {
      firebaseLogout();
    }
    navigate('/');
  };

  const displayUser = authType === 'firebase' ? currentUser?.data : {
    firstName: currentUser?.address?.slice(0, 6) || 'User',
    lastName: ''
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'tokens', label: 'Tokens', icon: Coins },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary shadow-lg flex flex-col border-r fixed h-full">
        {/* Header */}
        <div className="p-6 border-b border-primary-foreground/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-highlight rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">TibaTrust</span>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-1">Management Dashboard</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-primary-foreground/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-highlight rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-primary-foreground font-medium">{displayUser?.firstName}</p>
              <div className="flex items-center gap-2">
                <p className="text-primary-foreground/70 text-sm">
                  {authType === 'blockchain' ? 'Web3 User' : 'Standard User'}
                </p>
                {authType === 'blockchain' && (
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded text-white">Web3</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-highlight text-primary font-medium' 
                      : 'text-primary-foreground hover:bg-primary-foreground/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-foreground/20">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-primary-foreground hover:bg-primary-foreground/10 justify-start"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white ml-64 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;