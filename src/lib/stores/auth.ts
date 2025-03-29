import { writable } from 'svelte/store';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        isAuthenticated: false,
        user: null,
        token: null
    });

    return {
        subscribe,
        login: (token: string, user: User) => {
            set({ isAuthenticated: true, token, user });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ isAuthenticated: false, token: null, user: null });
        },
        initialize: () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                set({ 
                    isAuthenticated: true, 
                    token, 
                    user: JSON.parse(user) 
                });
            }
        }
    };
}

export const authStore = createAuthStore(); 