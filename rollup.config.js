import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/index.js',
		format: 'esm',
		sourcemap: true,
	},
	plugins: [
		nodeResolve(),
		esbuild({
			minify: true,
			treeShaking: true,
			target: 'esnext',
		}),
	],
};
