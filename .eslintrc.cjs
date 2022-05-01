'use strict';

module.exports = {
  env: {
    commonjs: true,
    node: true,
    es6: true
  },
  settings: {
    polyfills: [
      'Number.parseFloat'
    ]
  },
  extends: ['ash-nazg/sauron-node-overrides'],
  globals: {
    require: 'readonly',
    module: 'readonly',
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  overrides: [
    {
      files: '**/*.cjs',
      extends: ['ash-nazg/sauron-node-script-overrides'],
      env: {
        node: true,
        commonjs: true
      },
      globals: {
        __dirname: 'readonly'
      },
      rules: {
        // Not sure why showing up, as not a browser environment
        'no-implicit-globals': 'off'
      }
    },
    {
      files: '*.html',
      rules: {
        'import/unambiguous': 0
      }
    },
    {
      files: ['test/**'],
      globals: {
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
    ecmaVersion: 2022
  },
  rules: {
    // No need in Node-only
    'import/no-commonjs': 0,
    'no-process-exit': 0, // Re-added by n/recommended-script, so disable
    'compat/compat': 0,
    'no-console': 0,

    // Disable for now
    'eslint-comments/require-description': 0
  }
};
