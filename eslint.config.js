import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import promisePlugin from "eslint-plugin-promise";

export default [
    {
        files: ["**/*.js", "**/*.ts"],
        ignores: ["node_modules/", "dist/", "resources/"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                window: true,
                console: true,
                module: true,
                require: true,
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            promise: promisePlugin,
        },
        rules: {
            "@typescript-eslint/no-var-requires": 0,
            "@typescript-eslint/no-explicit-any": "off",
            'computed-property-spacing': ["error", "never"],
        },
    },
];