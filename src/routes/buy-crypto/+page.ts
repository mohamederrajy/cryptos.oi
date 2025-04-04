import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { session } from '$lib/stores/session';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
    const sessionData = get(session);
    if (!sessionData.isAuthenticated) {
        throw redirect(302, '/login');
    }
    return {
        user: sessionData.user
    };
}; 