import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, query, orderBy, getDoc } from 'firebase/firestore';

export interface Community {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  maxMembers: number;
  createdBy: string;
  createdAt: string;
  members: string[];
  admins?: string[];
  pendingRequests?: string[];
  tokenContribution?: number;
}

export interface CommunityWithStatus extends Community {
  isJoined: boolean;
  isOwner: boolean;
  memberCount: number;
}

export class CommunityService {
  static async createCommunity(
    name: string,
    description: string,
    location: string,
    category: string,
    maxMembers: number,
    createdBy: string
  ): Promise<string> {
    const communityData = {
      name,
      description,
      location,
      category,
      maxMembers,
      createdBy,
      createdAt: new Date().toISOString(),
      members: [createdBy],
      admins: [createdBy],
      pendingRequests: [],
      tokenContribution: 100
    };

    const docRef = await addDoc(collection(db, 'communities'), communityData);
    return docRef.id;
  }

  static async getAllCommunities(): Promise<Community[]> {
    const q = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Community));
  }

  static async getCommunitiesWithStatus(userId: string): Promise<CommunityWithStatus[]> {
    const communities = await this.getAllCommunities();
    
    return communities.map(community => ({
      ...community,
      isJoined: community.members.includes(userId),
      isOwner: community.createdBy === userId,
      memberCount: community.members.length,
      admins: community.admins || [community.createdBy]
    }));
  }

  static async joinCommunity(communityId: string, userId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    await updateDoc(communityRef, {
      members: arrayUnion(userId)
    });
  }

  static async leaveCommunity(communityId: string, userId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    await updateDoc(communityRef, {
      members: arrayRemove(userId)
    });
  }

  static async getUserCommunities(userId: string): Promise<CommunityWithStatus[]> {
    const communities = await this.getCommunitiesWithStatus(userId);
    return communities.filter(c => c.isJoined);
  }

  static async getAvailableCommunities(userId: string): Promise<CommunityWithStatus[]> {
    const communities = await this.getCommunitiesWithStatus(userId);
    return communities.filter(c => !c.isJoined);
  }

  static async searchCommunities(searchQuery: string): Promise<Community[]> {
    const communities = await this.getAllCommunities();
    return communities.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  static async requestToJoin(communityId: string, userId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    await updateDoc(communityRef, {
      pendingRequests: arrayUnion(userId)
    });
  }

  static async approveJoinRequest(communityId: string, userId: string, adminId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.admins?.includes(adminId) && community.createdBy !== adminId) {
      throw new Error('Not authorized');
    }

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
    if (!community.admins?.includes(adminId) && community.createdBy !== adminId) {
      throw new Error('Not authorized');
    }

    await updateDoc(communityRef, {
      pendingRequests: arrayRemove(userId)
    });
  }

  static async makeAdmin(communityId: string, userId: string, adminId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.admins?.includes(adminId) && community.createdBy !== adminId) {
      throw new Error('Not authorized');
    }

    await updateDoc(communityRef, {
      admins: arrayUnion(userId)
    });
  }

  static async updateTokenContribution(communityId: string, amount: number, adminId: string): Promise<void> {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const community = communityDoc.data() as Community;
    if (!community.admins?.includes(adminId) && community.createdBy !== adminId) {
      throw new Error('Not authorized');
    }

    await updateDoc(communityRef, {
      tokenContribution: amount
    });
  }
}