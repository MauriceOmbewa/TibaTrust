import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  arrayUnion, 
  arrayRemove,
  getDoc
} from 'firebase/firestore';

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

export class CommunityService {
  static async getAllCommunities(): Promise<Community[]> {
    const querySnapshot = await getDocs(collection(db, 'communities'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
  }

  static async createCommunity(name: string, description: string, creatorId: string, tokenContribution: number): Promise<Community> {
    const communities = await this.getAllCommunities();
    
    if (communities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('Community name already exists');
    }

    const communityData = {
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

    const docRef = await addDoc(collection(db, 'communities'), communityData);
    return { id: docRef.id, ...communityData };
  }

  static async searchCommunities(query: string): Promise<Community[]> {
    const communities = await this.getAllCommunities();
    return communities.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.id.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async requestToJoin(communityId: string, userId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (community.members.includes(userId)) throw new Error('Already a member');
    if (community.pendingRequests.includes(userId)) throw new Error('Request already pending');

    await updateDoc(communityRef, {
      pendingRequests: arrayUnion(userId)
    });
  }

  static async approveJoinRequest(communityId: string, userId: string, adminId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');

    await updateDoc(communityRef, {
      pendingRequests: arrayRemove(userId),
      members: arrayUnion(userId)
    });
  }

  static async declineJoinRequest(communityId: string, userId: string, adminId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');

    await updateDoc(communityRef, {
      pendingRequests: arrayRemove(userId)
    });
  }

  static async makeAdmin(communityId: string, userId: string, adminId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');
    if (!community.members.includes(userId)) throw new Error('User not a member');

    if (!community.admins.includes(userId)) {
      await updateDoc(communityRef, {
        admins: arrayUnion(userId)
      });
    }
  }

  static async updateTokenContribution(communityId: string, amount: number, adminId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.admins.includes(adminId)) throw new Error('Not authorized');

    await updateDoc(communityRef, {
      tokenContribution: amount
    });
  }

  static async getUserCommunities(userId: string): Promise<Community[]> {
    const communities = await this.getAllCommunities();
    return communities.filter(c => c.members.includes(userId));
  }

  static async createSupportRequest(communityId: string, requesterId: string, amount: number, reason: string): Promise<void> {
    const communityDoc = await getDoc(doc(db, 'communities', communityId));
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.members.includes(requesterId)) throw new Error('Not a member');

    const requestData = {
      communityId,
      requesterId,
      amount,
      reason,
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
      contributors: []
    };

    const docRef = await addDoc(collection(db, 'supportRequests'), requestData);
    
    // Auto-process after 10 minutes
    setTimeout(() => this.processSupportRequest(docRef.id), 10 * 60 * 1000);
  }

  static async getAllSupportRequests(): Promise<SupportRequest[]> {
    const querySnapshot = await getDocs(collection(db, 'supportRequests'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportRequest));
  }

  static async processSupportRequest(requestId: string): Promise<void> {
    const requestRef = doc(db, 'supportRequests', requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) return;
    
    const request = requestDoc.data() as SupportRequest;
    if (request.status !== 'pending') return;

    const communityDoc = await getDoc(doc(db, 'communities', request.communityId));
    if (!communityDoc.exists()) return;
    
    const community = communityDoc.data() as Community;

    // Deduct tokens from all members
    const contributors = community.members
      .filter(memberId => memberId !== request.requesterId)
      .map(memberId => {
        this.deductTokens(memberId, community.tokenContribution);
        return { userId: memberId, amount: community.tokenContribution };
      });

    // Add tokens to requester
    this.addTokens(request.requesterId, request.amount);
    
    await updateDoc(requestRef, {
      status: 'completed',
      contributors
    });
  }

  private static deductTokens(userId: string, amount: number): void {
    console.log(`Deducting ${amount} tokens from user ${userId}`);
  }

  private static addTokens(userId: string, amount: number): void {
    console.log(`Adding ${amount} tokens to user ${userId}`);
  }
}