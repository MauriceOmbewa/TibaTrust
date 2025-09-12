import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommunityService } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Crown, Settings } from 'lucide-react';

interface AdminPanelProps {
  userId: string;
  adminCommunities: any[];
  onUpdate: () => void;
}

export const AdminPanel = ({ userId, adminCommunities, onUpdate }: AdminPanelProps) => {
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [newTokenAmount, setNewTokenAmount] = useState<number>(50);
  const { toast } = useToast();

  const handleApproveRequest = (communityId: string, requestUserId: string) => {
    try {
      CommunityService.approveJoinRequest(communityId, requestUserId, userId);
      toast({ title: 'Success', description: 'Join request approved!' });
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeclineRequest = (communityId: string, requestUserId: string) => {
    try {
      CommunityService.declineJoinRequest(communityId, requestUserId, userId);
      toast({ title: 'Success', description: 'Join request declined' });
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleMakeAdmin = (communityId: string, memberId: string) => {
    try {
      CommunityService.makeAdmin(communityId, memberId, userId);
      toast({ title: 'Success', description: 'User promoted to admin!' });
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateTokens = (communityId: string) => {
    try {
      CommunityService.updateTokenContribution(communityId, newTokenAmount, userId);
      toast({ title: 'Success', description: 'Token contribution updated!' });
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (adminCommunities.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">You don't admin any communities yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {adminCommunities.map((community) => (
        <Card key={community.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              {community.name}
              <Badge variant="secondary">Admin</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pending Requests */}
            {community.pendingRequests.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Pending Join Requests</h4>
                <div className="space-y-2">
                  {community.pendingRequests.map((requestUserId: string) => (
                    <div key={requestUserId} className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">User: {requestUserId}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveRequest(community.id, requestUserId)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeclineRequest(community.id, requestUserId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members Management */}
            <div>
              <h4 className="font-medium mb-3">Members ({community.members.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {community.members.map((memberId: string) => (
                  <div key={memberId} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      {memberId} 
                      {community.admins.includes(memberId) && (
                        <Badge variant="outline" className="ml-2">Admin</Badge>
                      )}
                    </span>
                    {!community.admins.includes(memberId) && memberId !== userId && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMakeAdmin(community.id, memberId)}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        Make Admin
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Community Settings
              </h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newTokenAmount}
                  onChange={(e) => setNewTokenAmount(Number(e.target.value))}
                  placeholder="Token contribution"
                  className="w-32"
                />
                <Button onClick={() => handleUpdateTokens(community.id)}>
                  Update Token Contribution
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current: {community.tokenContribution} tokens per support request
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};