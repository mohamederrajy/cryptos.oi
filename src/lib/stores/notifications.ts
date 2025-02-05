// Create a new store for notifications
import { writable } from 'svelte/store';

interface Notification {
    type: 'success' | 'error' | 'info';
    message: string;
}

function createNotificationStore() {
    const { subscribe, set } = writable<Notification | null>(null);

    return {
        subscribe,
        success: (message: string) => set({ type: 'success', message }),
        error: (message: string) => set({ type: 'error', message }),
        info: (message: string) => set({ type: 'info', message }),
        clear: () => set(null)
    };
}

export const notifications = createNotificationStore(); 