import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { token, user } = await request.json();
        
        if (!token) {
            return json({ success: false, message: 'No token provided' }, { status: 400 });
        }

        // Set the auth token cookie
        cookies.set('authToken', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        // Optionally store user data in a cookie as well
        if (user) {
            cookies.set('user', JSON.stringify(user), {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error setting auth cookie:', error);
        return json(
            { success: false, message: 'Failed to set authentication' },
            { status: 500 }
        );
    }
}; 