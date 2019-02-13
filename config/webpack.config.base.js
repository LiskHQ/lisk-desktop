const path = require('path');

const webpackBase = {
  entry: {
    app: path.resolve(__dirname, '../src/main.js'),
    vendor: ['@babel/polyfill', 'url-polyfill', 'react', 'redux', 'react-dom', 'react-redux'],
    'head.css': path.resolve(__dirname, '../src/assets/css/styles.head.css'),
  },
  output: {
    path: path.resolve(__dirname, '../app', '../dist'),
    filename: 'bundle.[name].js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /styles\.head\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
        ],
      },
      {
        test: /^((?!styles\.head).)*\.css$/,
        use: [
          // 'css-hot-loader',
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss-loader',
              sourceMap: true,
              sourceComments: true,
              plugins: [
                /* eslint-disable import/no-extraneous-dependencies */
                require('postcss-partial-import')({}),
                require('postcss-mixins')({}),
                require('postcss-nesting')({}),
                require('postcss-preset-env')({}),
                require('postcss-functions')({
                  functions: {
                    rem: px => `${(px / 10)}rem`,
                  },
                }),
                require('postcss-for')({}),
              ],
            },
          },
        ],
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
};

module.exports = webpackBase;
