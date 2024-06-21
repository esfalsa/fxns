import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig} */
export default [
	{ ignores: ['coverage/*', 'dist/*'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/consistent-type-imports': 'error',
		},
	},
	{
		...tseslint.configs.disableTypeChecked,
		files: ['*.config.{js,mjs,ts}'],
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					varsIgnorePattern: '^_',
				},
			],
		},
	},
	eslintConfigPrettier,
];
