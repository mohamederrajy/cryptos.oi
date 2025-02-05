import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['lightweight-charts']
	},
	server: {
		proxy: {
			'/api': {
				target: process.env.PUBLIC_API_URL,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
	resolve: {
		dedupe: ['lightweight-charts']
	},
	build: {
		rollupOptions: {
			external: ['lightweight-charts'],
		}
	}
});
