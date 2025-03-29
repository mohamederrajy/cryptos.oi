import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
    // Double-check authentication
    if (!locals.user || !locals.token) {
        console.log('🚫 Layout Check: No valid session');
        
        // Clear any invalid session
        cookies.delete('authToken', { path: '/' });
        cookies.delete('user', { path: '/' });
        
        throw redirect(303, '/account/login');
    }

    // Ensure we have valid user data
    if (!locals.user.email || locals.user.email === 'undefined') {
        console.log('🚫 Layout Check: Invalid user data');
        
        cookies.delete('authToken', { path: '/' });
        cookies.delete('user', { path: '/' });
        
        throw redirect(303, '/account/login');
    }

    return {
        user: locals.user,
        isAuthenticated: true
    };
};