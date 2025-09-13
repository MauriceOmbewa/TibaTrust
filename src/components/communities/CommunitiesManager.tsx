import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Users, MapPin, Calendar, Crown, UserCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Community {
  id: string;
  name: string;
  description: string;
  location: string;
  members: number;
  maxMembers: number;
  category: string;
  isJoined: boolean;
  isOwner: boolean;
  createdAt: string;
  avatar?: string;
}

const MOCK_COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'Nairobi Health Circle',
    description: 'Supporting healthcare access in Nairobi and surrounding areas',
    location: 'Nairobi, Kenya',
    members: 245,
    maxMembers: 500,
    category: 'Regional',
    isJoined: true,
    isOwner: false,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Young Professionals Health',
    description: 'Healthcare support network for young working professionals',
    location: 'Kenya',
    members: 89,
    maxMembers: 200,
    category: 'Professional',
    isJoined: false,
    isOwner: false,
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    name: 'Mombasa Coastal Care',
    description: 'Coastal region healthcare community',
    location: 'Mombasa, Kenya',
    members: 156,
    maxMembers: 300,
    category: 'Regional',
    isJoined: true,
    isOwner: true,
    createdAt: '2024-01-20'
  }
];

export const CommunitiesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useApp();

  const myCommunities = MOCK_COMMUNITIES.filter(c => c.isJoined);
  const availableCommunities = MOCK_COMMUNITIES.filter(c => !c.isJoined);
  
  const filteredAvailable = availableCommunities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CommunityCard = ({ community, showJoinButton = false }: { community: Community; showJoinButton?: boolean }) => (
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
              {community.members}/{community.maxMembers}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(community.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${(community.members / community.maxMembers) * 100}%` }}
            />
          </div>
          
          {showJoinButton && (
            <Button className="w-full" size="sm">
              <UserCheck className="w-4 h-4 mr-2" />
              Join Community
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

  const CreateCommunityForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Create New Community</CardTitle>
        <CardDescription>Start a new healthcare support community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Community Name</label>
          <Input placeholder="Enter community name" />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input placeholder="Describe your community's purpose" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input placeholder="City, County" />
          </div>
          <div>
            <label className="text-sm font-medium">Max Members</label>
            <Input type="number" placeholder="100" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1">Create Community</Button>
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

      {showCreateForm && <CreateCommunityForm />}

      <Tabs defaultValue="my-communities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-communities">My Communities ({myCommunities.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="my-communities" className="space-y-4">
          {myCommunities.length === 0 ? (
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

          {filteredAvailable.length === 0 ? (
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