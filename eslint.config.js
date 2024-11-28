import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs["flat/recommended"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ["**/*.svelte", "**/*.ts"],

		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-explicit-any": "off",
		}
	},
	{
		ignores: ["build/", ".svelte-kit/", "dist/"]
	}
);
