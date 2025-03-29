import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchUserProfile } from '$lib/services/userService';
import { session } from '$lib/stores/session';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

export const load: PageLoad = async ({ fetch }) => {
    const sessionData = get(session);
    if (!sessionData.isAuthenticated) {
        throw redirect(302, '/account/login');
    }

    // Check for token first
    const token = browser ? localStorage.getItem('token') : null;
    
    if (!token) {
        return {
            profile: null
        };
    }

    try {
        // Try to get profile data
        const profile = await fetchUserProfile(fetch);
        
        if (profile) {
            // Update session with profile data
            session.updateProfile(profile);
            
            return {
                profile
            };
        }

        return {
            profile: null
        };
    } catch (error) {
        console.error('Failed to load profile:', error);
    return {
            profile: null
    };
    }
}; 