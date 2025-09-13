import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, query, orderBy } from 'firebase/firestore';

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
      members: [createdBy]
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
      memberCount: community.members.length
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
}