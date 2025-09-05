// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [{
  ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**'],
}, js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: { ...globals.browser, ...globals.node },
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
  },
  rules: {
    ...react.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    ...reactHooks.configs.recommended.rules,
    ...jsxA11y.configs.recommended.rules,
  },
  settings: {
    react: { version: 'detect' },
  },
}, ...storybook.configs["flat/recommended"]];
