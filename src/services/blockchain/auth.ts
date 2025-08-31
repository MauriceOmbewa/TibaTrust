import { ethers } from 'ethers';
import { connectWallet, getProvider, getSigner } from './web3';

export interface BlockchainUser {
  address: string;
  signature: string;
  message: string;
  timestamp: number;
}

export class BlockchainAuth {
  private static readonly MESSAGE_PREFIX = 'TibaTrust Authentication - ';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static generateAuthMessage(address: string): string {
    const timestamp = Date.now();
    return `${this.MESSAGE_PREFIX}${address} - ${timestamp}`;
  }

  static async authenticateWithWallet(): Promise<BlockchainUser> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet authentication not available in server environment');
    }
    
    try {
      // Connect wallet
      const address = await connectWallet();
      
      // Generate message to sign
      const message = this.generateAuthMessage(address);
      
      // Get signature
      const signer = await getSigner();
      const signature = await signer.signMessage(message);
      
      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Signature verification failed');
      }

      const user: BlockchainUser = {
        address,
        signature,
        message,
        timestamp: Date.now()
      };

      // Store in localStorage (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('blockchain_auth', JSON.stringify(user));
      }
      
      return user;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message || error}`);
    }
  }

  static getStoredAuth(): BlockchainUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem('blockchain_auth');
      if (!stored) return null;

      const user: BlockchainUser = JSON.parse(stored);
      
      // Check if session expired
      if (Date.now() - user.timestamp > this.SESSION_DURATION) {
        this.logout();
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }

  static async verifyStoredAuth(): Promise<boolean> {
    const user = this.getStoredAuth();
    if (!user) return false;

    try {
      const recoveredAddress = ethers.verifyMessage(user.message, user.signature);
      return recoveredAddress.toLowerCase() === user.address.toLowerCase();
    } catch {
      return false;
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('blockchain_auth');
    }
  }

  static isAuthenticated(): boolean {
    const user = this.getStoredAuth();
    return user !== null;
  }

  static getCurrentUser(): BlockchainUser | null {
    return this.getStoredAuth();
  }
}