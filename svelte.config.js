
import sveltePreprocess from 'svelte-preprocess'

/*
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess()
}
*/



import adapter from '@sveltejs/adapter-static';

const config = {
  preprocess: sveltePreprocess(),
	kit: {
		adapter: adapter({
			fallback: '404.html',
			pages: 'docs',
			assets: 'docs'
		}),
		paths: {
	      base: '/ship-incident-rates' // replace with your GitHub repository name
	      //base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};

export default config;

/*
import adapter from '@sveltejs/adapter-static';
import pkg from 'svelte-preprocess';
const { sveltePreprocess } = pkg;

const dev = process.argv.includes('dev');

const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sveltePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
	  adapter: adapter(),
      paths: {
        base: dev ? '' : process.env.BASE_PATH,
      }
	}
};

export default config;

/*


import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'docs',
			assets: 'docs',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};
export default config;

*/
/*
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/ship-incident-rates' // replace with your GitHub repository name
    }
  }
};
*/

