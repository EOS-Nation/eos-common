module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'jest',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
    ],
    rules: {
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/class-name-casing": "off"
    }
};