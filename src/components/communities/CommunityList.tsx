import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommunityService } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, UserPlus } from 'lucide-react';

interface CommunityListProps {
  userId: string;
  userCommunities: any[];
  onUpdate: () => void;
}

export const CommunityList = ({ userId, userCommunities, onUpdate }: CommunityListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = CommunityService.searchCommunities(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({ title: 'Error', description: 'Search failed', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleJoinRequest = (communityId: string) => {
    try {
      CommunityService.requestToJoin(communityId, userId);
      toast({ title: 'Success', description: 'Join request sent!' });
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const isUserMember = (communityId: string) => {
    return userCommunities.some(c => c.id === communityId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Communities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or ID (e.g., COM123)"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((community) => (
                <div key={community.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">{community.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">ID: {community.id}</span>
                        <span className="text-xs text-muted-foreground">
                          <Users className="h-3 w-3 inline mr-1" />
                          {community.members.length} members
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {community.tokenContribution} tokens/support
                        </span>
                      </div>
                    </div>
                    <div>
                      {isUserMember(community.id) ? (
                        <Badge variant="default">Member</Badge>
                      ) : (
                        <Button size="sm" onClick={() => handleJoinRequest(community.id)}>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Communities</CardTitle>
        </CardHeader>
        <CardContent>
          {userCommunities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              You haven't joined any communities yet
            </p>
          ) : (
            <div className="space-y-3">
              {userCommunities.map((community) => (
                <div key={community.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">{community.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">ID: {community.id}</span>
                        <span className="text-xs text-muted-foreground">
                          <Users className="h-3 w-3 inline mr-1" />
                          {community.members.length} members
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {community.admins.includes(userId) && (
                        <Badge variant="secondary">Admin</Badge>
                      )}
                      <Badge variant="default">Member</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};