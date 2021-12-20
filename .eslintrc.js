module.exports = {
  globals: {
    VERSION: 'readonly',
    ROUTER_MODE: 'readonly',
    NODE_ENV: 'readonly'
  },
  ignorePatterns: ['dist/**/*.js'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  extends: ['plugin:vue/recommended', '@vue/prettier', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    semi: 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'security/detect-new-buffer': 'off',
    'security/detect-object-injection': 'off',
    'require-atomic-updates': 'off',
    'no-prototype-builtins': 'off',
    'no-irregular-whitespace': [
      'error',
      {
        skipComments: true,
        skipTemplates: true,
        skipStrings: true,
        skipRegExps: true
      }
    ],
    'vue/custom-event-name-casing': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
