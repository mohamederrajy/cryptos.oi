import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    // Check if user is already logged in
    const token = cookies.get('authToken');
    const userCookie = cookies.get('user');

    if (token && userCookie) {
        try {
            const user = JSON.parse(userCookie);
            if (user && user.email) {
                // If valid session exists, redirect to dashboard
                throw redirect(303, '/dashboard');
            }
        } catch {
            // Clear invalid session
            cookies.delete('authToken', { path: '/' });
            cookies.delete('user', { path: '/' });
        }
    }

    return {};
}; 