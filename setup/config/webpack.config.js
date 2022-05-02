const webpack = require('webpack');
const { resolve } = require('path');

const config = {
  mode: 'development',
  resolve: {
    alias: {
      src: resolve('./src'),
      '@fixtures': resolve('./tests/fixtures'),
      '@scripts': resolve('./scripts'),
      '@setup': resolve('./setup'),
      '@tests': resolve('./tests'),
      '@block': resolve('./src/modules/block'),
      '@bookmark': resolve('./src/modules/bookmark'),
      '@search': resolve('./src/modules/search'),
      '@common': resolve('./packages/common'),
      '@legacy': resolve('./src/modules/legacy'),
      '@dpos': resolve('./src/modules/dpos'),
      '@network': resolve('./packages/network'),
      '@settings': resolve('./packages/settings'),
      '@token': resolve('./packages/token'),
      '@transaction': resolve('./packages/transaction'),
      '@updater': resolve('./packages/updater'),
      '@wallet': resolve('./packages/wallet'),
      '@views': resolve('./packages/views'),
      '@shared': resolve('./packages/views/shared'),
      '@basics': resolve('./packages/views/basics'),
      '@screens': resolve('./packages/views/screens'),
      '@libs': resolve('./libs'),
    },
    fallback: {
      net: false,
      fs: false,
      os: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
    },
  },
  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb',
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        resolve: {
          extensions: ['.js'],
        },
        options: {
          presets: [
            [
              '@babel/preset-env', {
                modules: false,
                targets: {
                  browsers: ['last 2 versions', 'safari >= 7'],
                },
              }],
            '@babel/preset-react',
          ],
          plugins: [
            'syntax-trailing-function-commas',
            'import-glob',
            [
              '@babel/plugin-transform-runtime',
              {
                helpers: false,
                regenerator: true,
              },
            ],
          ],
          env: {
            test: {
              plugins: ['istanbul'],
            },
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        exclude: [/images/],
        options: {
          name: '[path][name]-[hash:6].[ext]',
        },
        loader: 'file-loader',
      },
      {
        test: /\.(png|svg)$/,
        exclude: [/fonts/],
        loader: 'url-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NACL_FAST: 'disable',
    }),
  ],
};

module.exports = config;
