// Create types for user profile
export interface WalletBalance {
    USDT: number;
}

export interface Wallet {
    totalBalance: WalletBalance;
    assetBalance: WalletBalance;
    exchangeBalance: WalletBalance;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isAdmin: boolean;
    wallet: Wallet;
    createdAt?: string;
    profileImage?: string;
} 