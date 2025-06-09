import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), basicSsl()],

	server: {
		host: 'https://zzic.xiyo.dev'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
