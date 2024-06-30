import nodeResolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import macros from 'unplugin-parcel-macros';

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
		macros.rollup(),
		esbuild({
			minify: true,
			treeShaking: true,
			target: 'esnext',
		}),
	],
};
