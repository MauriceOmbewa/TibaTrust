import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityService } from '@/services/communityService';
import { CreateCommunity } from './CreateCommunity';
import { CommunityList } from './CommunityList';
import { AdminPanel } from './AdminPanel';

interface CommunityManagerProps {
  userId: string;
}

export const CommunityManager = ({ userId }: CommunityManagerProps) => {
  const [userCommunities, setUserCommunities] = useState<any[]>([]);
  const [adminCommunities, setAdminCommunities] = useState<any[]>([]);

  const loadUserCommunities = async () => {
    const communities = await CommunityService.getUserCommunities(userId);
    setUserCommunities(communities);
    setAdminCommunities(communities.filter(c => c.admins.includes(userId)));
  };

  useEffect(() => {
    loadUserCommunities();
  }, [userId]);

  return (
    <Tabs defaultValue="browse" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="browse">Browse</TabsTrigger>
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="admin">Admin ({adminCommunities.length})</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>
      
      <TabsContent value="browse">
        <CommunityList 
          userId={userId} 
          userCommunities={userCommunities}
          onUpdate={loadUserCommunities}
        />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateCommunity 
          userId={userId} 
          onCommunityCreated={loadUserCommunities}
        />
      </TabsContent>
      
      <TabsContent value="admin">
        <AdminPanel 
          userId={userId} 
          adminCommunities={adminCommunities}
          onUpdate={loadUserCommunities}
        />
      </TabsContent>
      
      <TabsContent value="support">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Support request feature coming soon</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};