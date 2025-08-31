import { ethers } from 'ethers';

export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// Use Base Sepolia for testing
export const CURRENT_CHAIN_ID = BASE_SEPOLIA_CHAIN_ID;

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export const CONTRACT_ABI = [
  "function registerUser(uint256 _planId) external payable",
  "function payPremium() external payable",
  "function payPremiumForPlan(uint256 _planId) external payable",
  "function donate() external payable",
  "function balanceOf(address) external view returns (uint256)",
  "function users(address) external view returns (uint256, uint256, uint256, bool)",
  "function plans(uint256) external view returns (uint256, uint256, bool)",
  "function totalDonations() external view returns (uint256)",
  "function getContractBalance() external view returns (uint256)",
  "event UserRegistered(address indexed user, uint256 planId)",
  "event PremiumPaid(address indexed user, uint256 amount)",
  "event DonationReceived(address indexed donor, uint256 amount)"
];

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      return new ethers.BrowserProvider(window.ethereum);
    } catch (error) {
      console.warn('Failed to create provider:', error);
      return null;
    }
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) throw new Error('No wallet connected');
  return await provider.getSigner();
};

export const getContract = async () => {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error('Contract not deployed yet. Please deploy the smart contract first.');
  }
  try {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (error: any) {
    throw new Error(`Failed to get contract: ${error.message}`);
  }
};

export const connectWallet = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Wallet connection not available in server environment');
  }
  
  if (!window.ethereum) {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Switch to Base Sepolia testnet
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CURRENT_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Add Base Sepolia network if not exists
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${CURRENT_CHAIN_ID.toString(16)}`,
            chainName: 'Base Sepolia',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
          }],
        });
      }
    }

    const provider = getProvider();
    if (!provider) {
      throw new Error('Failed to initialize provider');
    }
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error: any) {
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

export const formatEther = (value: bigint) => {
  return ethers.formatEther(value);
};

export const parseEther = (value: string) => {
  return ethers.parseEther(value);
};