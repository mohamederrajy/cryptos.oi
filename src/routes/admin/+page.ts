import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { session } from '$lib/stores/session';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
    throw redirect(302, '/admin/statistics');
}; 