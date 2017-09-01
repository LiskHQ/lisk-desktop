/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { NamedModulesPlugin } = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
/* eslint-enable */

const reactToolboxVariables = {
  'color-primary': '#0288D1',
  'color-primary-dark': '#0288D1',
  'button-border-radius': '3px',
  'input-text-label-color': 'rgba(0,0,0,0.38)',
};

let entries = {
  app: `${path.resolve(__dirname, 'src')}/main.js`,
  vendor: ['react', 'redux', 'react-dom'],
};
const external = {
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true,
};
module.exports = (env) => {
  entries = env.test ? `${path.resolve(__dirname, 'src')}/main.js` : entries;
  return {
    entry: entries,
    output: {
      path: path.resolve(__dirname, 'app', 'dist'),
      filename: env.test ? 'bundle.js' : 'bundle.[name].js',
    },
    devtool: env.test ? 'inline-source-map' : 'source-map',
    devServer: {
      contentBase: 'src',
      inline: true,
      port: 8080,
      historyApiFallback: true,
    },
    plugins: [
      new StyleLintPlugin({
        context: `${path.resolve(__dirname, 'src')}/`,
        files: '**/*.css',
        config: {
          extends: 'stylelint-config-standard',
          rules: {
            'selector-pseudo-class-no-unknown': null,
            'unit-whitelist': ['px', 'deg', '%', 'em', 'ms'],
            'length-zero-no-unit': null,
          },
          ignoreFiles: './node_modules/**/*.css',
        },
      }),
      new webpack.DefinePlugin({
        PRODUCTION: env.prod,
        TEST: env.test,
        // because of https://fb.me/react-minification
        'process.env': {
          NODE_ENV: env.prod ? JSON.stringify('production') : null,
        },
      }),
      new ExtractTextPlugin({
        filename: 'styles.css',
        allChunks: true,
      }),
      env.prod
        ? new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          mangle: false,
        })
        : undefined,
      env.analyze ? new BundleAnalyzerPlugin() : undefined,
      !env.prod ? new NamedModulesPlugin() : undefined,
      env.test
        ? undefined
        : new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
        }),
    ].filter(p => !!p),
    externals: env.test ? external : {},
    node: {
      fs: 'empty',
      child_process: 'empty',
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: !env.prod ? {
            emitWarning: true,
          } : {},
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-3'],
            plugins: ['syntax-trailing-function-commas'],
            env: {
              test: {
                plugins: ['istanbul'],
              },
            },
          },
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png)$/,
          loader: 'url-loader',
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: !env.prod,
                  modules: true,
                  importLoaders: 1,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: !env.prod,
                  sourceComments: !env.prod,
                  plugins: [
                    // eslint-disable-next-line import/no-extraneous-dependencies
                    require('postcss-partial-import')({ /* options */ }),
                    require('postcss-cssnext')({
                      features: {
                        customProperties: {
                          variables: reactToolboxVariables,
                        },
                      },
                    }),
                    // eslint-disable-next-line import/no-extraneous-dependencies
                    require('postcss-for')({ /* options */ }),
                  ],
                },
              },
            ],
          }),
        },
        {
          test: /\.json$/,
          use: ['json-loader'],
        },
      ],
    },
  };
};
