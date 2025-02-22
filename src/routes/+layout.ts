import { session } from '$lib/stores/session';
import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
    // Initialize session
    session.initialize();

    // List of routes that require authentication
    const protectedRoutes = [
        '/admin',
        '/wallets',
        '/exchange',
        '/activities'
    ];

    // Check if current path starts with any protected route
    const isProtectedRoute = protectedRoutes.some(route => 
        url.pathname.startsWith(route)
    );

    // Get user and check if admin
    const user = session.getUser();
    const isAdmin = user?.role === 'admin';

    // Redirect non-admins from admin routes
    if (url.pathname.startsWith('/admin') && !isAdmin) {
        throw redirect(302, '/');
    }

    // Only redirect to login if trying to access protected routes without session
    if (isProtectedRoute && !session.checkSession()) {
        throw redirect(302, '/account/login');
    }

    return {
        user,
        isAuthenticated: session.checkSession(),
        isAdmin
    };
} 