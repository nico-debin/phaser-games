module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-namespace': 1,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'always'],
    'computed-property-spacing': ['error', 'never'],
  },
};
