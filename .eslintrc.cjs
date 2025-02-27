module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'preact', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['unicorn', '@typescript-eslint'],
  root: true,
  rules: {
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'prefer-const': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
      },
    ],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['.'],
      },
      typescript: {},
    },
  },
};
