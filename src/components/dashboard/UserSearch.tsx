import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User } from 'lucide-react';

interface UserSearchProps {
  onUserSelect?: (uid: string) => void;
}

const UserSearch = ({ onUserSelect }: UserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockUsers = [
    { uid: 'UID000001', name: 'John Doe', email: 'john@example.com' },
    { uid: 'UID000002', name: 'Jane Smith', email: 'jane@example.com' },
    { uid: 'UID000003', name: 'Mike Johnson', email: 'mike@example.com' },
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const results = mockUsers.filter(user => 
        user.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input 
          placeholder="Enter UID or name to search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map((user) => (
            <Card key={user.uid} className="cursor-pointer hover:bg-accent" onClick={() => onUserSelect?.(user.uid)}>
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.uid}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {searchTerm && searchResults.length === 0 && !isSearching && (
        <p className="text-sm text-muted-foreground">No users found</p>
      )}
    </div>
  );
};

export default UserSearch;