interface Community {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  admins: string[];
  members: string[];
  pendingRequests: string[];
  tokenContribution: number;
  isActive: boolean;
}

interface SupportRequest {
  id: string;
  communityId: string;
  requesterId: string;
  amount: number;
  reason: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'completed';
  contributors: { userId: string; amount: number }[];
}

const COMMUNITIES_KEY = 'tibatrust_communities';
const SUPPORT_REQUESTS_KEY = 'tibatrust_support_requests';

export class CommunityService {
  static getAllCommunities(): Community[] {
    const stored = localStorage.getItem(COMMUNITIES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveCommunities(communities: Community[]): void {
    localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(communities));
  }

  static createCommunity(name: string, description: string, creatorId: string, tokenContribution: number): Community {
    const communities = this.getAllCommunities();
    
    if (communities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('Community name already exists');
    }

    const community: Community = {
      id: 'COM' + Date.now().toString(36).toUpperCase(),
      name,
      description,
      createdBy: creatorId,
      createdAt: new Date().toISOString(),
      admins: [creatorId],
      members: [creatorId],
      pendingRequests: [],
      tokenContribution,
      isActive: true
    };

    communities.push(community);
    this.saveCommunities(communities);
    return community;
  }

  static searchCommunities(query: string): Community[] {
    const communities = this.getAllCommunities();
    return communities.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.id.toLowerCase().includes(query.toLowerCase())
    );
  }

  static requestToJoin(communityId: string, userId: string): void {
    const communities = this.getAllCommunities();
    const community = communities.find(c => c.id === communityId);
    
    if (!community) throw new Error('Community not found');
    if (community.members.includes(userId)) throw new Error('Already a member');
    if (community.pendingRequests.includes(userId)) throw new Error('Request already pending');

    community.pendingRequests.push(userId);
    this.saveCommunities(communities);
  }

  static approveJoinRequest(communityId: string, userId: string, adminId: string): void {
    const communities = this.getAllCommunities();
    const community = communities.find(c => c.id === communityId);
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');

    community.pendingRequests = community.pendingRequests.filter(id => id !== userId);
    community.members.push(userId);
    this.saveCommunities(communities);
  }

  static declineJoinRequest(communityId: string, userId: string, adminId: string): void {
    const communities = this.getAllCommunities();
    const community = communities.find(c => c.id === communityId);
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');

    community.pendingRequests = community.pendingRequests.filter(id => id !== userId);
    this.saveCommunities(communities);
  }

  static makeAdmin(communityId: string, userId: string, adminId: string): void {
    const communities = this.getAllCommunities();
    const community = communities.find(c => c.id === communityId);
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');
    if (!community.members.includes(userId)) throw new Error('User not a member');

    if (!community.admins.includes(userId)) {
      community.admins.push(userId);
      this.saveCommunities(communities);
    }
  }

  static updateTokenContribution(communityId: string, amount: number, adminId: string): void {
    const communities = this.getAllCommunities();
    const community = communities.find(c => c.id === communityId);
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');

    community.tokenContribution = amount;
    this.saveCommunities(communities);
  }

  static getUserCommunities(userId: string): Community[] {
    const communities = this.getAllCommunities();
    return communities.filter(c => c.members.includes(userId));
  }

  static createSupportRequest(communityId: string, requesterId: string, amount: number, reason: string): void {
    const community = this.getAllCommunities().find(c => c.id === communityId);
    if (!community) throw new Error('Community not found');
    if (!community.members.includes(requesterId)) throw new Error('Not a member');

    const requests = this.getAllSupportRequests();
    const request: SupportRequest = {
      id: 'REQ' + Date.now().toString(36).toUpperCase(),
      communityId,
      requesterId,
      amount,
      reason,
      createdAt: new Date().toISOString(),
      status: 'pending',
      contributors: []
    };

    requests.push(request);
    this.saveSupportRequests(requests);

    // Auto-process after 10 minutes
    setTimeout(() => this.processSupportRequest(request.id), 10 * 60 * 1000);
  }

  static getAllSupportRequests(): SupportRequest[] {
    const stored = localStorage.getItem(SUPPORT_REQUESTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveSupportRequests(requests: SupportRequest[]): void {
    localStorage.setItem(SUPPORT_REQUESTS_KEY, JSON.stringify(requests));
  }

  static processSupportRequest(requestId: string): void {
    const requests = this.getAllSupportRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request || request.status !== 'pending') return;

    const community = this.getAllCommunities().find(c => c.id === request.communityId);
    if (!community) return;

    // Deduct tokens from all members
    community.members.forEach(memberId => {
      if (memberId !== request.requesterId) {
        this.deductTokens(memberId, community.tokenContribution);
        request.contributors.push({
          userId: memberId,
          amount: community.tokenContribution
        });
      }
    });

    // Add tokens to requester
    this.addTokens(request.requesterId, request.amount);
    request.status = 'completed';
    
    this.saveSupportRequests(requests);
  }

  private static deductTokens(userId: string, amount: number): void {
    // Integration with UserDataService would go here
    console.log(`Deducting ${amount} tokens from user ${userId}`);
  }

  private static addTokens(userId: string, amount: number): void {
    // Integration with UserDataService would go here
    console.log(`Adding ${amount} tokens to user ${userId}`);
  }
}