import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    rules: {
      semi: ['error', 'always'],
      'prefer-const': 'warn',
    },
  },
]);
