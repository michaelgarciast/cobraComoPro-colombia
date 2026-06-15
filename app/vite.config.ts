import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'cobracomopro',
				project: 'javascript-sveltekit',
				authToken: process.env.SENTRY_AUTH_TOKEN
			}
		}),
		sveltekit()
	]
});
