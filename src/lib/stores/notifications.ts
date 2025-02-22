// Create a new store for notifications
import { writable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    title?: string;
    duration?: number;
    dismissible?: boolean;
}

function createNotificationStore() {
    const { subscribe, set, update } = writable<Notification[]>([]);

    const store = {
        subscribe,
        add: (notification: Omit<Notification, 'id'>) => {
            // Only add notification if there's a valid message
            if (!notification.message) return;
            
            const id = Math.random().toString(36).slice(2);
            update(notifications => [
                ...notifications,
                { 
                    id, 
                    duration: 5000, // Default duration
                    dismissible: true, // Default dismissible
                    ...notification 
                }
            ]);

            // Auto-remove notification after duration
            if (notification.duration !== 0) {
                setTimeout(() => {
                    store.remove(id);
                }, notification.duration || 5000);
            }
        },
        remove: (id: string) => {
            update(notifications => notifications.filter(n => n.id !== id));
        },
        clear: () => set([]),
        success: (message?: string, options = {}) => {
            if (!message) return;
            store.add({ type: 'success', message, ...options });
        },
        error: (message?: string, options = {}) => {
            // If no message provided, use a default one
            const displayMessage = message || 'An error occurred. Please try again.';
            store.add({ type: 'error', message: displayMessage, ...options });
        },
        warning: (message?: string, options = {}) => {
            if (!message) return;
            store.add({ type: 'warning', message, ...options });
        },
        info: (message?: string, options = {}) => {
            if (!message) return;
            store.add({ type: 'info', message, ...options });
        }
    };

    return store;
}

export const notifications = createNotificationStore(); 