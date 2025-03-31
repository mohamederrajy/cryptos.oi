import type { LayoutLoad } from './$types';
import { fetchUserProfile } from '$lib/services/userService';
import { session } from '$lib/stores/session';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ fetch, url }) => {
    console.log('Layout load starting for path:', url.pathname);
    
    try {
        const token = browser ? localStorage.getItem('token') : null;
        const currentUser = session.getUser();
        
        // If we have a token and user, we're good
        if (token && currentUser) {
            return {
                user: currentUser,
                isAuthenticated: true,
                isAdmin: currentUser.role === 'admin'
            };
        }

        // If we have a token but no user, try to fetch profile
        if (token) {
            try {
                const profile = await fetchUserProfile(fetch);
                if (profile) {
                    session.set({
                        isAuthenticated: true,
                        user: profile,
                        loading: false,
                        token
                    });

                    return {
                        user: profile,
                        isAuthenticated: true,
                        isAdmin: profile.role === 'admin'
                    };
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        }

        // List of protected routes
        const protectedRoutes = ['/admin', '/wallets', '/exchange', '/activities', '/profile'];
        const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

        // Redirect to login if trying to access protected route without token
        if (isProtectedRoute && !token) {
            console.log('Protected route access denied, redirecting to login');
            throw redirect(302, '/login');
        }

        return {
            user: null,
            isAuthenticated: false,
            isAdmin: false
        };

    } catch (error) {
        console.error('Layout load error:', error);
        
        if (error instanceof redirect) {
            throw error;
        }

        return {
            user: null,
            isAuthenticated: false,
            isAdmin: false
        };
    }
}; 