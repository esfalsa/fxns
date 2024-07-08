import nodeResolve from '@rollup/plugin-node-resolve';
import macros from 'unplugin-parcel-macros';
import swc from 'rollup-plugin-swc3';

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
		swc({
			minify: true,
			jsc: { minify: { sourceMap: true } },
			sourceMaps: true,
		}),
	],
};
