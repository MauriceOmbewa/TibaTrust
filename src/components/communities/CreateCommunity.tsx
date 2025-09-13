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
  const [tokenContribution, setTokenContribution] = useState(50);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setIsCreating(true);
    try {
      const community = await CommunityService.createCommunity(name, description, userId, tokenContribution);
      toast({ title: 'Success', description: `Community "${community.name}" created successfully!` });
      setName('');
      setDescription('');
      setTokenContribution(50);
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
        <div>
          <label className="text-sm font-medium">Default Token Contribution</label>
          <Input
            type="number"
            value={tokenContribution}
            onChange={(e) => setTokenContribution(Number(e.target.value))}
            placeholder="Tokens per member for support"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Amount deducted from each member when someone needs support
          </p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className="w-full">
          {isCreating ? 'Creating...' : 'Create Community'}
        </Button>
      </CardContent>
    </Card>
  );
};