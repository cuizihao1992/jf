module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['lit', 'html', 'import'],
  extends: [
    'eslint:recommended', // 推荐的基础规则
    'plugin:lit/recommended', // Lit 推荐规则
    'plugin:import/recommended', // 模块导入规则
  ],
  rules: {
    // 自定义规则
    'lit/no-template-bind': 'off', // 如果需要允许模板绑定
    'import/order': ['warn', { groups: [['builtin', 'external', 'internal']] }], // 模块导入顺序
  },
};
