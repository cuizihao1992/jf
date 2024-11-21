module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['server/**/*.js'],
      env: {
        node: true,
      },
      parserOptions: {
        ecmaVersion: 12,
      },
      rules: {
        // `server` 特有规则
        'no-console': 'off',
      },
    },
  ],
};
