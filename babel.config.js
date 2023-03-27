module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
        targets: { browsers: ['last 2 versions', 'safari >= 7'] },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'syntax-trailing-function-commas',
    'import-glob',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    'transform-class-properties',
    'react-hot-loader/babel',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: true,
          },
        ],
        'transform-class-properties',
      ],
    },
  },
};
