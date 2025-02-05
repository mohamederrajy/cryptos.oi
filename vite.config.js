import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    // Add this if you want to see the loaded env variables during development
    define: {
        'process.env': process.env
    }
}); 