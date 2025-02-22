import { session } from '$lib/stores/session';
import { redirect } from '@sveltejs/kit';

export function load() {
    if (session.checkSession()) {
        throw redirect(302, '/');
    }
    return {};
} 