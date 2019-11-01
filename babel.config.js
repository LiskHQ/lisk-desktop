module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: { browsers: ['last 2 versions', 'safari >= 7'] },
    },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'syntax-trailing-function-commas',
    'import-glob',
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
    }],
    'transform-class-properties',
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
      plugins: [
        ['@babel/plugin-transform-runtime', {
          regenerator: true,
        }],
        'transform-class-properties',
      ],
    },
  },
};
