import { writable } from 'svelte/store';
import type { UserProfile } from '$lib/types/user';
import { fetchUserProfile } from '$lib/services/userService';
import { browser } from '$app/environment';

interface Session {
    isAuthenticated: boolean;
    token: string | null;
    user: UserProfile | null;
}

function createSessionStore() {
    // Initialize from localStorage if available
    const initialState: Session = {
        isAuthenticated: false,
        token: null,
        user: null
    };

    if (browser) {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            initialState.isAuthenticated = true;
            initialState.token = token;
            initialState.user = JSON.parse(savedUser);
        }
    }

    const { subscribe, set, update } = writable<Session>(initialState);

    return {
        subscribe,
        initialize: async () => {
            if (!browser) return;
            
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const profile = await fetchUserProfile();
                    const sessionData = {
                        isAuthenticated: true,
                        token,
                        user: profile
                    };
                    set(sessionData);
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            }
        },
        checkSession: () => {
            if (!browser) return false;
            const token = localStorage.getItem('token');
            return !!token;
        },
        getUser: () => {
            if (!browser) return null;
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        },
        login: async (token: string, basicUser: any) => {
            if (!browser) return;
            
            console.log('Basic user data:', basicUser);
            
            const initialSession = {
                isAuthenticated: true,
                token,
                user: basicUser
            };
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(basicUser));
            set(initialSession);
            
            try {
                const profile = await fetchUserProfile();
                console.log('Full user profile:', profile);
                const fullSession = {
                    ...initialSession,
                    user: profile
                };
                
                localStorage.setItem('user', JSON.stringify(profile));
                set(fullSession);
            } catch (error) {
                console.error('Failed to fetch full profile:', error);
            }
        },
        logout: () => {
            if (!browser) return;
            
            // Clear all session data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
                isAuthenticated: false,
                token: null,
                user: null
            });
        },
        updateProfile: (profile: UserProfile) => {
            if (!browser) return;
            
            localStorage.setItem('user', JSON.stringify(profile));
            update(state => ({
                ...state,
                user: profile
            }));
        },
        updateWallet: (wallet: any) => {
            update(state => ({
                ...state,
                user: {
                    ...state.user,
                    wallet
                }
            }));
        }
    };
}

export const session = createSessionStore(); 