module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:typescript-sort-keys/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
	],
	overrides: [
		{
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
			],
			files: ["**/*.{ts,tsx}"],
			parserOptions: {
				project: ["./tsconfig.json"],
				tsconfigRootDir: __dirname,
			},
			rules: {},
		},
		{
			files: "*.json",
			parser: "jsonc-eslint-parser",
			rules: {
				"jsonc/sort-keys": "error",
			},
			extends: ["plugin:jsonc/recommended-with-json"],
		},
	],
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint",
		"react",
		"react-hooks",
		"simple-import-sort",
		"typescript-sort-keys",
	],
	root: true,
	rules: {
		"simple-import-sort/exports": "error",
		"simple-import-sort/imports": "error",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};

// module.exports = {
//   env: { browser: true, es2020: true },
//   extends: [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:react-hooks/recommended",
//   ],
//   parser: "@typescript-eslint/parser",
//   parserOptions: { ecmaVersion: "latest", sourceType: "module" },
//   plugins: ["react-refresh"],
//   rules: {
//     "react-refresh/only-export-components": "warn",
//   },
// };
