import js from '@eslint/js'
import globals from 'globals'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'
import reactPlugin from 'eslint-plugin-react'
import reactQueryPlugin from '@tanstack/eslint-plugin-query'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import unicornPlugin from 'eslint-plugin-unicorn'
import packageJson from 'eslint-plugin-package-json/configs/recommended'
import reactCompilerPlugin from 'eslint-plugin-react-compiler'

export default tseslint.config(
  {
    ignores: ['dist/*', 'build/*', 'coverage/*', 'docs/*', 'jsdoc/*', 'templates/*', 'tests/*', 'tmp/*', 'node_modules/*', 'client/dist/', 'eslint.config.js'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error', // Remove unused eslint-disable comments
    },
  },

  // Base linter
  js.configs.recommended,
  packageJson,
  ...fixupConfigRules(importPlugin.flatConfigs.recommended),
  ...tailwindcssPlugin.configs['flat/recommended'],

  // Stylist
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      ...stylistic.configs['recommended-flat'].rules,
      '@stylistic/arrow-parens': ['warn', 'as-needed'],
      '@stylistic/jsx-closing-bracket-location': [1],
      '@stylistic/max-len': ['warn', { code: 200, tabWidth: 2 }],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['warn', 'never', { beforeStatementContinuationChars: 'never' }],
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/indent': ['warn', 2, { SwitchCase: 1 }],
    },
  },

  // File name
  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
    },
  },

  // Typescript
  {
    extends: [
      // ...tseslint.configs.strictTypeChecked,
      // ...tseslint.configs.recommendedTypeChecked,
      // ...tseslint.configs.stylisticTypeChecked,
      ...tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        allowDefaultProject: ['*.config.*s', 'bin/*.js', 'script/*.ts', '*.d.ts'],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'react': { version: 'detect' },
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'import/no-cycle': 'error',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
      'import/namespace': 'off', // ! error (linter do not support flat config yet)
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // disables cross-feature imports:
            // eg. src/features/org should not import from src/features/project, etc.
            // {
            //   target: './src/features/auth',
            //   from: './src/features',
            //   except: ['./auth'],
            // },
            // enforce unidirectional codebase:
            // e.g. src/app can import from src/features but not the other way around
            // {
            //   target: './src/features',
            //   from: './src/app',
            // },
            // e.g src/features and src/app can import from these shared modules but not the other way around

            // {
            //   target: [
            //     './src/api',
            //     './src/assets',
            //     './src/components',
            //     './src/config',
            //     './src/hooks',
            //     './src/lib',
            //     './src/store',
            //     './src/style',
            //     './src/types',
            //     './src/utils',
            //   ],
            //   from: ['./src/features', './src/app'],
            // },
          ],
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          'minimumDescriptionLength': 5,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': ['error', { ignorePrimitives: true }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowBoolean: true, allowNullish: true, allowNumber: true }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      // Stylistic concerns that don't interfere with Prettier
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
    },
  },

  // React
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null,
      },
    },
    plugins: {
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'react-refresh': reactRefreshPlugin,
      '@tanstack/query': reactQueryPlugin,
      'react-compiler': fixupPluginRules(reactCompilerPlugin),
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true, allowExportNames: ['loader', 'action'] }],
      '@tanstack/query/exhaustive-deps': 'error',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'warn',
      'react-compiler/react-compiler': 'error',
    },
  },

  // Tailwind
  {
    files: ['**/*.tsx'],
    settings: {
      tailwindcss: {
        callees: ['clsx', 'cn', 'cva'],
      },
    },
    rules: {
      'tailwindcss/no-custom-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': ['warn', {
        callees: ['clsx', 'cn', 'cva']
      }],
    },
  },
)
