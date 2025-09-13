import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityService } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';

interface CreateCommunityProps {
  userId: string;
  onCommunityCreated: () => void;
}

export const CreateCommunity = ({ userId, onCommunityCreated }: CreateCommunityProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Regional');
  const [maxMembers, setMaxMembers] = useState(100);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim() || !description.trim() || !location.trim()) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsCreating(true);
    try {
      const communityId = await CommunityService.createCommunity(name, description, location, category, maxMembers, userId);
      toast({ title: 'Success', description: `Community "${name}" created successfully!` });
      setName('');
      setDescription('');
      setLocation('');
      setCategory('Regional');
      setMaxMembers(100);
      onCommunityCreated();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Community</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Community Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter unique community name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your community's purpose"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, County"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Regional">Regional</option>
              <option value="Professional">Professional</option>
              <option value="Age Group">Age Group</option>
              <option value="Special Interest">Special Interest</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Max Members</label>
          <Input
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
            placeholder="Maximum number of members"
          />
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className="w-full">
          {isCreating ? 'Creating...' : 'Create Community'}
        </Button>
      </CardContent>
    </Card>
  );
};