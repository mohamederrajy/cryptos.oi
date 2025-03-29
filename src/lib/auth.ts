import { PUBLIC_API_URL } from '$env/static/public';
import { authStore } from './stores/auth';
import { goto } from '$app/navigation';
import { notifications } from './stores/notifications';
import { session } from './stores/session';

interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export async function signup(data: SignupData) {
    try {
        const response = await fetch(`${PUBLIC_API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Signup failed');
        }

        return result;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

export async function login(data: LoginData): Promise<LoginResponse> {
    try {
        const response = await fetch(`${PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const result = await response.json();

        if (result.token) {
            // Update session store
            session.login(result.token, result.user);
            
            // Show success notification
            notifications.success('Welcome back! Redirecting to dashboard...');
        }

        return result;
    } catch (error) {
        notifications.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        throw error;
    }
}

export function logout() {
    session.logout();
    notifications.success('Successfully logged out');
    goto('/account/login');
}

export function isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
}

export function getToken(): string | null {
    return localStorage.getItem('token');
} 