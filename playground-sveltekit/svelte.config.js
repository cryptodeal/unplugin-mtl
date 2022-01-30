import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import MtlFileImport from 'unplugin-mtl/vite';
import ObjFileImport from 'unplugin-obj/vite';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [MtlFileImport(), ObjFileImport()],
			ssr: {
				noExternal: ['three']
			},
			resolve: {}
		}
	}
};

// eslint-disable-next-line no-undef
if (process.env.SERVER_ENV === 'Vercel') {
	config.kit.vite.resolve = {
		alias: {
			'unplugin-mtl': path.resolve('../src')
		}
	};
}

export default config;
