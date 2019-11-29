const MiniCssExtractPlugin = require('mini-css-extract-plugin');/* eslint-disable-line import/no-extraneous-dependencies */

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      allChunks: true,
      filename: 'styles.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /^((?!styles\.head).)*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              // minimize: true,
              // importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              sourceComments: true,
              plugins: [
                /* eslint-disable import/no-extraneous-dependencies */
                require('postcss-partial-import')({}),
                require('postcss-mixins')({}),
                require('postcss-nesting')({}),
                require('postcss-preset-env')({
                  stage: 0,
                }),
                require('postcss-functions')({
                  functions: {
                    rem: px => `${(px / 10)}rem`,
                  },
                }),
                require('postcss-for')({}),
                /* eslint-enable import/no-extraneous-dependencies */
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
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { modules: false }],
            '@babel/preset-react',
          ],
          plugins: [
            'syntax-trailing-function-commas',
            'import-glob',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-syntax-import-meta',
            ['@babel/plugin-proposal-class-properties', { loose: false }],
            '@babel/plugin-proposal-json-strings',
          ],
        },
      },
    ],
  },
};
