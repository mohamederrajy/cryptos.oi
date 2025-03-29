import { PUBLIC_API_URL } from '$env/static/public';
import { browser } from '$app/environment';

export interface Wallet {
    totalBalance: {
        USDT: number;
    };
    assetBalance: {
        USDT: number;
    };
    exchangeBalance: {
        USDT: number;
    };
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    isAdmin: boolean;
    createdAt: string;
    wallet: Wallet;
}

export async function fetchUserProfile(customFetch = fetch): Promise<UserProfile | null> {
    if (!browser) {
        console.log('Not in browser environment, returning null');
        return null;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found in localStorage');
        return null;
    }

    console.log('Attempting to fetch profile with token:', token.substring(0, 10) + '...');

    try {
        console.log('Making request to:', 'http://localhost:5003/api/auth/me');
        const response = await customFetch('http://localhost:5003/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error('Profile fetch failed with status:', response.status);
            const errorText = await response.text();
            console.error('Error response body:', errorText);
            return null;
        }

        const data = await response.json();
        console.log('Profile data received:', JSON.stringify(data, null, 2));
        return data.profile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
        return null;
    }
}

interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: File;
}

export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    if (!browser) throw new Error('Cannot update profile on server');
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${PUBLIC_API_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        const result = await response.json();
        return result.profile;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export async function updateProfile(data: { firstName: string; lastName: string; email: string }) {
    if (!browser) throw new Error('Cannot update profile on server');
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch('http://localhost:5003/api/auth/update-profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        const result = await response.json();
        return result.profile;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
} 