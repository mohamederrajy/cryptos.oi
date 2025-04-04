import { writable } from 'svelte/store';
import type { UserProfile } from '$lib/services/userService';
import { browser } from '$app/environment';

interface SessionState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    loading: boolean;
    token?: string | null;
}

function createSessionStore() {
    // Initialize with token from localStorage if available
    const initialToken = browser ? localStorage.getItem('token') : null;
    
    const { subscribe, set, update } = writable<SessionState>({
        isAuthenticated: !!initialToken,
        user: null,
        loading: true,
        token: initialToken
    });

    return {
        subscribe,
        set,
        update,
        initialize: async () => {
            if (!browser) return;
            
            const token = localStorage.getItem('token');
            if (token) {
                // Keep existing session if we have a token
                update(state => ({
                    ...state,
                    isAuthenticated: true,
                    token,
                    loading: false
                }));
            } else {
                set({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    token: null
                });
            }
        },
        getUser: () => {
            let state: SessionState | undefined;
            subscribe(s => state = s)();
            return state?.user || null;
        },
        checkSession: () => {
            let state: SessionState | undefined;
            subscribe(s => state = s)();
            
            // Consider session valid if we have a token
            const token = browser ? localStorage.getItem('token') : null;
            return !!token;
        },
        login: (token: string, user: UserProfile) => {
            if (!browser) return;
            
            localStorage.setItem('token', token);
            
            set({
                isAuthenticated: true,
                user,
                loading: false,
                token
            });
        },
        logout: () => {
            if (browser) {
                localStorage.removeItem('token');
            }
            
            set({
                isAuthenticated: false,
                user: null,
                loading: false,
                token: null
            });
        },
        updateProfile: (profile: UserProfile) => {
            const token = browser ? localStorage.getItem('token') : null;
            
            update(state => ({
                ...state,
                user: profile,
                isAuthenticated: true,
                token
            }));
        },
        updateWallet: (wallet: any) => {
            update(state => ({
                ...state,
                user: state.user ? {
                    ...state.user,
                    wallet
                } : null
            }));
        },
        clear() {
            this.update(state => ({
                token: null,
                user: null,
                isAuthenticated: false
            }));
        }
    };
}

export const session = createSessionStore(); 