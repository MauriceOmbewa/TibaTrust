import { getContract, parseEther, formatEther } from './web3';

export interface InsurancePlan {
  id: number;
  name: string;
  monthlyPremium: string;
  coverageLimit: string;
}

export interface Claim {
  id: number;
  patient: string;
  amount: string;
  description: string;
  approved: boolean;
  paid: boolean;
  timestamp: number;
}

export interface User {
  planId: number;
  lastPremiumPayment: number;
  totalPremiumsPaid: string;
  active: boolean;
}

export const INSURANCE_PLANS: InsurancePlan[] = [
  { id: 1, name: 'Basic', monthlyPremium: '500', coverageLimit: '50000' },
  { id: 2, name: 'Standard', monthlyPremium: '1000', coverageLimit: '100000' },
  { id: 3, name: 'Premium', monthlyPremium: '2500', coverageLimit: '250000' },
];

export const registerUser = async (planId: number, premiumAmount: string) => {
  const contract = await getContract();
  const tx = await contract.registerUser(planId, {
    value: parseEther(premiumAmount)
  });
  return await tx.wait();
};

export const payPremium = async (premiumAmount: string) => {
  const contract = await getContract();
  const tx = await contract.payPremium({
    value: parseEther(premiumAmount)
  });
  return await tx.wait();
};

export const submitClaim = async (amount: string, description: string) => {
  const contract = await getContract();
  const tx = await contract.submitClaim(parseEther(amount), description);
  return await tx.wait();
};

export const donate = async (amount: string) => {
  const contract = await getContract();
  const tx = await contract.donate({
    value: parseEther(amount)
  });
  return await tx.wait();
};

export const getUserInfo = async (address: string): Promise<User> => {
  const contract = await getContract();
  const [planId, lastPremiumPayment, totalPremiumsPaid, active] = await contract.users(address);
  
  return {
    planId: Number(planId),
    lastPremiumPayment: Number(lastPremiumPayment),
    totalPremiumsPaid: formatEther(totalPremiumsPaid),
    active
  };
};

export const getUserClaims = async (address: string): Promise<number[]> => {
  const contract = await getContract();
  const claimIds = await contract.getUserClaims(address);
  return claimIds.map((id: bigint) => Number(id));
};

export const getClaim = async (claimId: number): Promise<Claim> => {
  const contract = await getContract();
  const [patient, amount, description, approved, paid, timestamp] = await contract.claims(claimId);
  
  return {
    id: claimId,
    patient,
    amount: formatEther(amount),
    description,
    approved,
    paid,
    timestamp: Number(timestamp)
  };
};

export const getTokenBalance = async (address: string): Promise<string> => {
  const contract = await getContract();
  const balance = await contract.balanceOf(address);
  return formatEther(balance);
};

export const getTotalDonations = async (): Promise<string> => {
  const contract = await getContract();
  const total = await contract.totalDonations();
  return formatEther(total);
};

export const getTotalClaims = async (): Promise<string> => {
  const contract = await getContract();
  const total = await contract.totalClaims();
  return formatEther(total);
};

export const getContractBalance = async (): Promise<string> => {
  const contract = await getContract();
  const balance = await contract.getContractBalance();
  return formatEther(balance);
};