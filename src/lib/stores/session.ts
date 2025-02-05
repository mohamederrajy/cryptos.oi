import { writable } from 'svelte/store';

interface Session {
    isAuthenticated: boolean;
    token: string | null;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | null;
}

function createSessionStore() {
    const { subscribe, set, update } = writable<Session>({
        isAuthenticated: false,
        token: null,
        user: null
    });

    return {
        subscribe,
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
        },
        login: (token: string, user: any) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({
                isAuthenticated: true,
                token,
                user
            });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
                isAuthenticated: false,
                token: null,
                user: null
            });
        }
    };
}

export const session = createSessionStore(); 