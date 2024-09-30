import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'coverage'
    ]
  },
  ...ashNazg(['sauron', 'node']),
  {
    files: ['test-helpers/sample.cjs'],
    rules: {
      'no-console': ['error']
    }
  },
  {
    rules: {
      // No need in Node-only
      'import/no-commonjs': 0,
      'no-console': 0
    }
  }
];
