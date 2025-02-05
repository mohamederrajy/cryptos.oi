import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');
        const rememberMe = data.get('rememberMe');

        // Basic validation
        if (!email || !password) {
            return fail(400, {
                error: 'Email and password are required'
            });
        }

        try {
            // Here you would typically:
            // 1. Validate credentials against your database
            // 2. Create a session
            // 3. Set cookies
            
            // For now, we'll just redirect to home
            throw redirect(303, '/');
        } catch (error) {
            return fail(500, {
                error: 'Login failed. Please try again.'
            });
        }
    }
} satisfies Actions; 