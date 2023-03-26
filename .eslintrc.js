module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/strict',
    'airbnb-base/legacy',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'class-methods-use-this': 'off',
    'indent': [
      'error',
      2
    ],
    "@typescript-eslint/consistent-type-definitions": ["off"],
    "@typescript-eslint/no-extraneous-class": "off",
    'no-empty-function': ['error', { 'allow': ['constructors'] }],
    'no-unused-vars': 'off',
    'semi': [
      'error',
      'never'
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "warn"
  },
};
