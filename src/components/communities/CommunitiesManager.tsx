import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Users, MapPin, Calendar, Crown, UserCheck, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { CommunityService, CommunityWithStatus } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';



export const CommunitiesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [communities, setCommunities] = useState<CommunityWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', location: '', category: 'Regional', maxMembers: 100 });
  const { user } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    loadCommunities();
  }, [user]);

  const loadCommunities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await CommunityService.getCommunitiesWithStatus(user.id);
      setCommunities(data);
    } catch (error) {
      console.error('Failed to load communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const myCommunities = communities.filter(c => c.isJoined);
  const availableCommunities = communities.filter(c => !c.isJoined);
  
  const filteredAvailable = availableCommunities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await CommunityService.joinCommunity(communityId, user!.id);
      toast({ title: 'Success', description: 'Joined community successfully!' });
      loadCommunities();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to join community', variant: 'destructive' });
    }
  };

  const handleCreateCommunity = async () => {
    try {
      await CommunityService.createCommunity(
        formData.name,
        formData.description,
        formData.location,
        formData.category,
        formData.maxMembers,
        user!.id
      );
      toast({ title: 'Success', description: 'Community created successfully!' });
      setShowCreateForm(false);
      setFormData({ name: '', description: '', location: '', category: 'Regional', maxMembers: 100 });
      loadCommunities();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create community', variant: 'destructive' });
    }
  };

  const CommunityCard = ({ community, showJoinButton = false }: { community: CommunityWithStatus; showJoinButton?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {community.name}
              {community.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
            </CardTitle>
            <CardDescription className="mt-1">{community.description}</CardDescription>
          </div>
          <Badge variant="outline">{community.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {community.location}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {community.memberCount}/{community.maxMembers}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(community.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${(community.memberCount / community.maxMembers) * 100}%` }}
            />
          </div>
          
          {showJoinButton && (
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => handleJoinCommunity(community.id)}
              disabled={community.memberCount >= community.maxMembers}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {community.memberCount >= community.maxMembers ? 'Full' : 'Join Community'}
            </Button>
          )}
          
          {community.isJoined && !showJoinButton && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              {community.isOwner && (
                <Button variant="outline" size="sm" className="flex-1">
                  Manage
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const createCommunityForm = (
    <Card>
      <CardHeader>
        <CardTitle>Create New Community</CardTitle>
        <CardDescription>Start a new healthcare support community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Community Name</label>
          <Input 
            placeholder="Enter community name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input 
            placeholder="Describe your community's purpose" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input 
              placeholder="City, County" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Members</label>
            <Input 
              type="number" 
              placeholder="100" 
              value={formData.maxMembers}
              onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value) || 100})}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={handleCreateCommunity}
            disabled={!formData.name || !formData.description}
          >
            Create Community
          </Button>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communities</h2>
          <p className="text-muted-foreground">Connect with healthcare support networks</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      {showCreateForm && createCommunityForm}

      <Tabs defaultValue="my-communities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-communities">My Communities ({myCommunities.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="my-communities" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : myCommunities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Communities Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You haven't joined any communities. Discover and join communities to get support.
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Community
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCommunities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search communities by name, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredAvailable.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Communities Found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? 'Try adjusting your search terms' : 'No available communities to join right now'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map(community => (
                <CommunityCard key={community.id} community={community} showJoinButton />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};