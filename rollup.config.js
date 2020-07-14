import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import autoPreprocess from 'svelte-preprocess';

import {config} from 'dotenv';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			dev: !production,
			css: css => { css.write('public/build/bundle.css'); },
			preprocess: autoPreprocess()
		}),

		resolve({ browser: true, dedupe: ['svelte'] }),
		commonjs(),
		replace({
			PROCESS: JSON.stringify({
				env: {
					isProd: production,
					...config().parsed
				}
			})
		}),

		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: { clearScreen: true }
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
