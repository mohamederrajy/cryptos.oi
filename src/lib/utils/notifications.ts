import { notifications } from '$lib/stores/notifications';
import type { NotificationType } from '$lib/stores/notifications';

interface NotifyOptions {
    duration?: number;
    dismissible?: boolean;
    title?: string;
}

function notify(type: NotificationType, message: string, options: NotifyOptions = {}) {
    notifications.add({
        type,
        message,
        ...options
    });
}

export const toast = {
    success: (message: string, options?: NotifyOptions) => notify('success', message, options),
    error: (message: string, options?: NotifyOptions) => notify('error', message, options),
    warning: (message: string, options?: NotifyOptions) => notify('warning', message, options),
    info: (message: string, options?: NotifyOptions) => notify('info', message, options)
};