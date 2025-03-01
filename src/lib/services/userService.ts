import { PUBLIC_API_URL } from '$env/static/public';
import { browser } from '$app/environment';

export async function fetchUserProfile() {
    if (!browser) return null;
    
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch(`${PUBLIC_API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: File;
}

export async function updateUserProfile(data: ProfileUpdateData): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const formData = new FormData();
        
        // Only append fields that are provided
        if (data.firstName) formData.append('firstName', data.firstName);
        if (data.lastName) formData.append('lastName', data.lastName);
        if (data.email) formData.append('email', data.email);
        if (data.profileImage) formData.append('profileImage', data.profileImage);

        const response = await fetch(`${PUBLIC_API_URL}/api/user/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        const result = await response.json();
        return result.user;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
} 