import { session } from '$lib/stores/session';
import { redirect } from '@sveltejs/kit';

// Add ActionData type
export interface ActionData {
    success?: boolean;
    error?: string;
}

// Add Window interface at top level
declare global {
    interface Window {
        grecaptcha: any;
        onRecaptchaVerify: (token: string) => void;
    }
}

export function load() {
    if (session.checkSession()) {
        throw redirect(302, '/');
    }
    return {};
} 