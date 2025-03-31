import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { session } from '$lib/stores/session';

export const load: LayoutLoad = async ({ url }) => {
    // Check if user is logged in
    if (!session.checkSession()) {
        throw redirect(302, '/login');
    }
    
    const currentUser = session.getUser();
    
    // Check if user is admin
    if (currentUser?.role !== 'admin') {
        throw redirect(302, '/');
    }
    
    return {
        user: currentUser,
        isAdmin: true
    };
}; 