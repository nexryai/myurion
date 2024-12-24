import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";


export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ["**/*.svelte", "**/*.ts", "**/*.js"],

        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        },
        rules: {
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "import/no-cycle": "error",
            // https://github.com/import-js/eslint-plugin-import/issues/2765
            "import/no-unresolved": "off",
            "import/no-named-as-default": "off",
            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "parent", "sibling", "index", "object"],
                    pathGroups: [
                        {
                            pattern: "{svelte,$app/**,elysia}",
                            group: "builtin",
                            position: "before",
                        },
                        {
                            pattern: "{@src/**,$lib/**,@prisma/client}",
                            group: "parent",
                            position: "before",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["type"],
                    alphabetize: {
                        order: "asc",
                    },
                    "newlines-between": "always",
                },
            ],
        }
    },
    {
        ignores: ["build/", ".svelte-kit/", "dist/"]
    }
);
