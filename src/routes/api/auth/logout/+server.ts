import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals }) => {
    console.log('Logging out user...');

    // Clear all cookies with full options
    cookies.delete('authToken', { 
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    
    cookies.delete('user', { 
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    // Clear locals
    locals.user = null;
    locals.token = null;

    return json({
        success: true,
        message: 'Logged out successfully',
        clearLocalStorage: true // Signal client to clear localStorage
    });
}; 