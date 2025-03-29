import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    // Protect all dashboard routes
    if (event.url.pathname.startsWith('/dashboard')) {
        const token = event.cookies.get('authToken');
        const userCookie = event.cookies.get('user');

        // Function to clear session and redirect
        const clearAndRedirect = () => {
            event.cookies.delete('authToken', { path: '/' });
            event.cookies.delete('user', { path: '/' });
            throw redirect(303, '/account/login');
        };

        // Immediate checks for token and user cookie
        if (!token || !userCookie) {
            console.log('No session found - redirecting to login');
            clearAndRedirect();
        }

        try {
            // Validate token format
            if (!token.startsWith('Bearer ')) {
                console.log('Invalid token format');
                clearAndRedirect();
            }

            // Parse and validate user data
            const user = JSON.parse(userCookie);
            if (!user || !user.email || user.email === 'undefined') {
                console.log('Invalid user data');
                clearAndRedirect();
            }

            // Set validated data in locals
            event.locals.user = user;
            event.locals.token = token;

        } catch (error) {
            console.log('Session validation failed:', error);
            clearAndRedirect();
        }
    }

    return await resolve(event);
};