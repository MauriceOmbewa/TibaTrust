// Currency conversion service
export class CurrencyService {
  private static ETH_TO_USD_API = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
  private static USD_TO_KSH_RATE = 150; // Approximate rate, can be updated
  private static cachedRate: number | null = null;
  private static lastFetch: number = 0;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getETHToKSHRate(): Promise<number> {
    const now = Date.now();
    
    // Return cached rate if still valid
    if (this.cachedRate && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedRate;
    }

    try {
      const response = await fetch(this.ETH_TO_USD_API);
      const data = await response.json();
      const ethToUsd = data.ethereum?.usd || 2500; // Fallback rate
      const ethToKsh = ethToUsd * this.USD_TO_KSH_RATE;
      
      this.cachedRate = ethToKsh;
      this.lastFetch = now;
      
      return ethToKsh;
    } catch (error) {
      console.warn('Failed to fetch ETH rate, using fallback:', error);
      // Fallback rate if API fails
      return 400000; // 1 ETH ≈ 400,000 KSH
    }
  }

  static formatETHToKSH(ethAmount: string | number): string {
    const eth = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
    const ksh = eth * (this.cachedRate || 400000);
    return `KSh ${ksh.toLocaleString()}`;
  }

  static formatKSHToETH(kshAmount: number): string {
    const eth = kshAmount / (this.cachedRate || 400000);
    return `${eth.toFixed(6)} ETH`;
  }
}