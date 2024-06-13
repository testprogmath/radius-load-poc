module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "ignorePatterns": ["node_modules/", "dist/", "resources/"],
    "overrides": [],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "@typescript-eslint",
        'promise',
    ],
    "rules": {
        '@typescript-eslint/no-var-requires': 0,
        "@typescript-eslint/no-explicit-any": "off",
        'promise/space-in-brackets': ['error', 'always'],
    }
}
