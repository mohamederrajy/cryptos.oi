export const mockUsers = [
    {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "user",
        wallet: {
            totalBalance: { btc: 1.5, usd: 45000 },
            assetBalance: { btc: 1.0, usd: 30000 },
            exchangeBalance: { btc: 0.5, usd: 15000 }
        }
    },
    {
        id: "2",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        role: "admin",
        wallet: {
            totalBalance: { btc: 2.5, usd: 75000 },
            assetBalance: { btc: 1.5, usd: 45000 },
            exchangeBalance: { btc: 1.0, usd: 30000 }
        }
    }
]; 