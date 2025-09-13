import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Navigate } from 'react-router-dom';
import { Send, UserPlus, CheckCircle, XCircle, Coins } from 'lucide-react';
import { MpesaPayment } from '@/components/payment/MpesaPayment';
import { WalletPayment } from '@/components/payment/WalletPayment';
import { TransactionMonitor } from '@/components/payment/TransactionMonitor';
import { WalletConnector } from '@/components/auth/WalletConnector';
import { UserDataService } from '@/services/userDataService';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import UserSearch from '@/components/dashboard/UserSearch';
import { CommunityManager } from '@/components/communities/CommunityManager';
import { CommunityService } from '@/services/communityService';


const Dashboard = () => {
  const { user } = useApp();
  const { isAuthenticated, currentUser, authType } = useUnifiedAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [tokenAmount, setTokenAmount] = useState('');
  const [recipientUID, setRecipientUID] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/blockchain-login" replace />;
  }

  const displayUser = authType === 'firebase' ? user : {
    firstName: currentUser?.address?.slice(0, 6) || 'User',
    lastName: '',
    email: currentUser?.address || '',
    id: currentUser?.address || '',
    phone: currentUser?.address || 'N/A',
    plan: 'Blockchain User'
  };

  // Real user data
  const userId = displayUser.id || displayUser.email;
  const coverageStatus = UserDataService.getCoverageStatus(userId);
  const nextPaymentDate = UserDataService.getNextPaymentDate(userId);
  const memberSince = UserDataService.getMemberSince(userId);
  const totalTokens = UserDataService.getTotalTokens(userId);
  const activePlan = UserDataService.getActivePlan(userId);
  const hasActivePlan = activePlan !== null;
  
  const userProfile = {
    ...displayUser,
    uid: 'UID' + userId.slice(-6),
    tokens: totalTokens,
    coverageStatus,
    memberSince: memberSince || 'Not activated',
    nextPaymentDue: hasActivePlan ? (nextPaymentDate ? new Date(nextPaymentDate).toLocaleDateString() : 'Calculating...') : 'Account not activated',
    monthlyPremium: activePlan === 1 ? 500 : activePlan === 2 ? 1000 : activePlan === 3 ? 2500 : 500,
    planName: activePlan === 1 ? 'Basic Plan' : activePlan === 2 ? 'Standard Plan' : activePlan === 3 ? 'Premium Plan' : 'No active plan',
    hasActivePlan
  };

  const availableCommunities: any[] = [];

  const handleTokenTransfer = () => {
    if (!recipientUID || !tokenAmount) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Success', description: `${tokenAmount} tokens sent to ${recipientUID}` });
    setRecipientUID('');
    setTokenAmount('');
  };

  const handleJoinCommunity = (communityId: string) => {
    toast({ title: 'Request Sent', description: 'Your join request has been submitted' });
  };

  const handlePaymentSuccess = () => {
    const userId = displayUser.id || displayUser.email;
    const planId = userProfile.hasActivePlan ? UserDataService.getActivePlan(userId) || 1 : 1; // Default to Basic plan
    
    // Record the payment
    UserDataService.addPayment(userId, planId, userProfile.monthlyPremium.toString());
    
    const message = userProfile.hasActivePlan ? 
      'Your monthly premium has been paid' : 
      'Your plan has been activated successfully!';
    
    toast({ title: 'Payment Successful', description: message });
    
    // Refresh the page to show updated data
    window.location.reload();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayUser.firstName}!</h1>
              <p className="text-muted-foreground">
                {authType === 'blockchain' ? 'Blockchain authenticated' : 'Traditional authenticated'} - 
                Manage your healthcare coverage and community connections.
              </p>
              {authType === 'blockchain' && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Wallet:</strong> {currentUser?.address}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coverage Status</CardTitle>
                  {userProfile.coverageStatus === 'Active' ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile.coverageStatus}</div>
                  <p className="text-xs text-muted-foreground">Since {userProfile.memberSince}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Tokens</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile.tokens}</div>
                  <p className="text-xs text-muted-foreground">TibaTrust Tokens</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  {userProfile.hasActivePlan ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-orange-600" />
                  }
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userProfile.hasActivePlan ? userProfile.nextPaymentDue : 'Not Active'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.hasActivePlan ? `KSh ${userProfile.monthlyPremium}` : 'Activate your plan'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Communities</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <TransactionMonitor />
            <Tabs defaultValue="wallet" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wallet">Wallet Payment</TabsTrigger>
              <TabsTrigger value="mpesa">M-Pesa Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet">
              <WalletPayment />
            </TabsContent>
            
            <TabsContent value="mpesa">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Premium Payment</CardTitle>
                  <CardDescription>Pay your monthly insurance premium to maintain coverage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">
                          {userProfile.hasActivePlan ? 'Monthly Premium' : 'Activate Your Plan'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {userProfile.hasActivePlan ? `Due: ${userProfile.nextPaymentDue}` : 'Choose a plan to get started'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">KSh {userProfile.monthlyPremium}</div>
                        <Badge variant={userProfile.hasActivePlan && userProfile.coverageStatus === 'Active' ? 'default' : 'destructive'}>
                          {userProfile.hasActivePlan ? userProfile.coverageStatus : 'Not Activated'}
                        </Badge>
                      </div>
                    </div>
                    <MpesaPayment 
                      amount={userProfile.monthlyPremium}
                      description={userProfile.hasActivePlan ? 'Monthly Insurance Premium' : 'Plan Activation Payment'}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            </Tabs>
          </div>
        );

      case 'communities':
        return (
          <CommunityManager userId={userId} />
        );

      case 'tokens':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Tokens</CardTitle>
                <CardDescription>Transfer tokens to another user by their UID</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient UID</label>
                  <Input 
                    placeholder="Enter user UID (e.g., UID000123)"
                    value={recipientUID}
                    onChange={(e) => setRecipientUID(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token Amount</label>
                  <Input 
                    type="number"
                    placeholder="Enter amount"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleTokenTransfer} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Tokens
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Users</CardTitle>
                <CardDescription>Find other users by their UID</CardDescription>
              </CardHeader>
              <CardContent>
                <UserSearch onUserSelect={(uid) => setRecipientUID(uid)} />
              </CardContent>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <WalletConnector />
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="font-medium">{userProfile.uid}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">{userProfile.firstName} {userProfile.lastName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="font-medium">{userProfile.phone || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Plan</label>
                    <p className="font-medium">{userProfile.plan || 'Standard'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Coverage Status</label>
                    <div className="flex items-center space-x-2">
                      {userProfile.coverageStatus === 'Active' ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> : 
                        <XCircle className="h-4 w-4 text-red-600" />
                      }
                      <span className="font-medium">{userProfile.coverageStatus}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="font-medium">{userProfile.memberSince}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Available Tokens</label>
                    <p className="font-medium">{userProfile.tokens} TibaTrust Tokens</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-8">
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;