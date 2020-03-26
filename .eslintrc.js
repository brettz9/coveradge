module.exports = {
  env: {
    node: true,
    es6: true
  },
  settings: {
    polyfills: [
    ]
  },
  extends: ['ash-nazg/sauron', 'plugin:node/recommended-script'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  overrides: [
    {
      files: '*.md',
      rules: {

      }
    },
    {
    files: '*.html',
      rules: {
        'import/unambiguous': 0
      }
    },
    {
      extends: [
        'plugin:node/recommended-module'
      ],
      files: ['test/**'],
      globals: {
        __dirname: true,
        expect: true
      },
      env: {
        mocha: true
      },
      rules: {
        'import/unambiguous': 0
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    // No need in Node-only
    'import/no-commonjs': 0,
    'no-process-exit': 0, // Re-added by node/recommended-script, so disable
    'compat/compat': 0,
    'no-console': 0
  }
};
