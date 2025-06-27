import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.angular/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/docker-compose.yml',
      '**/Dockerfile',
    ],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      semi: ['error', 'always'],
      'prefer-const': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
