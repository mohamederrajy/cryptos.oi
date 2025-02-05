// Create types for user profile
export interface Wallet {
    totalBalance: {
        btc: number;
        usd: number;
    };
    assetBalance: {
        btc: number;
        usd: number;
    };
    exchangeBalance: {
        btc: number;
        usd: number;
    };
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    wallet: Wallet;
    createdAt: string;
    profileImage?: string;
} 