import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const config = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      // eslint-plugin-react's "detect" calls context.getFilename(), which
      // ESLint 10 removed. Keep in sync with the installed React.
      react: {version: '19.3'},
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', {varsIgnorePattern: '_'}],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);
const eslintConfig = [...config, eslintConfigPrettier];

export default eslintConfig;
