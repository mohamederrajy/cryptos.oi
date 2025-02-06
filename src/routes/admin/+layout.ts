import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { session } from '$lib/stores/session';
import { get } from 'svelte/store';

export const load: LayoutLoad = async () => {
    const sessionData = get(session);
    if (!sessionData.isAuthenticated || sessionData.user?.role !== 'admin') {
        throw redirect(302, '/account/login');
    }
    return {
        user: sessionData.user
    };
}; 