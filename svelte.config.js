import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Mudança aqui: manda salvar os arquivos na pasta 'docs'
			pages: 'docs',
			assets: 'docs',
			fallback: '404.html'
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/AnalisadorLexico' : ''
		}
	}
};

export default config;