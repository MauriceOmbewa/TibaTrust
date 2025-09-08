interface PaymentRecord {
  planId: number;
  amount: string;
  date: string;
  transactionHash?: string;
}

interface UserData {
  userId: string;
  payments: PaymentRecord[];
  activePlan: number | null;
  firstPaymentDate: string | null;
  totalTokens: number;
}

const PLAN_TOKENS = {
  1: 1000, // Basic
  2: 2000, // Standard  
  3: 3000  // Premium
};

const STORAGE_KEY = 'tibatrust_user_data';

export class UserDataService {
  static getUserData(userId: string): UserData {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      userId,
      payments: [],
      activePlan: null,
      firstPaymentDate: null,
      totalTokens: 0
    };
  }

  static saveUserData(userData: UserData): void {
    localStorage.setItem(`${STORAGE_KEY}_${userData.userId}`, JSON.stringify(userData));
  }

  static addPayment(userId: string, planId: number, amount: string, transactionHash?: string): void {
    const userData = this.getUserData(userId);
    const payment: PaymentRecord = {
      planId,
      amount,
      date: new Date().toISOString(),
      transactionHash
    };

    userData.payments.push(payment);
    userData.activePlan = planId;
    
    if (!userData.firstPaymentDate) {
      userData.firstPaymentDate = payment.date;
    }

    // Add tokens for this plan
    userData.totalTokens += PLAN_TOKENS[planId as keyof typeof PLAN_TOKENS] || 0;

    this.saveUserData(userData);
  }

  static getCoverageStatus(userId: string): 'Active' | 'Inactive' {
    const userData = this.getUserData(userId);
    return userData.payments.length > 0 ? 'Active' : 'Inactive';
  }

  static getNextPaymentDate(userId: string): string | null {
    const userData = this.getUserData(userId);
    if (!userData.firstPaymentDate) return null;

    const firstPayment = new Date(userData.firstPaymentDate);
    const now = new Date();
    
    // Calculate how many months have passed since first payment
    const monthsPassed = (now.getFullYear() - firstPayment.getFullYear()) * 12 + 
                        (now.getMonth() - firstPayment.getMonth());
    
    // Next payment is always 30 days from the same day of next month
    const nextPayment = new Date(firstPayment);
    nextPayment.setMonth(firstPayment.getMonth() + monthsPassed + 1);
    
    return nextPayment.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  }

  static getActivePlan(userId: string): number | null {
    const userData = this.getUserData(userId);
    return userData.activePlan;
  }

  static getTotalTokens(userId: string): number {
    const userData = this.getUserData(userId);
    return userData.totalTokens;
  }

  static getMemberSince(userId: string): string | null {
    const userData = this.getUserData(userId);
    if (!userData.firstPaymentDate) return null;
    
    const date = new Date(userData.firstPaymentDate);
    return date.toISOString().split('T')[0];
  }

  static getPaymentHistory(userId: string): PaymentRecord[] {
    const userData = this.getUserData(userId);
    return userData.payments;
  }
}