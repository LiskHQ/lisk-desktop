const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const nodeEnvironment = process.env.NODE_ENV;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.resolve(__dirname, '..', 'app'),
  spec: path.join(__dirname, 'spec'),
  test: path.join(__dirname, 'test'),
};

const common = {
  devtool: 'source-map',
  entry: nodeEnvironment === 'test' ? {} : {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: 'app.js',
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery',
    },
  },
};

const clean = pathToClean => ({
  plugins: [
    new CleanWebpackPlugin([pathToClean], {
      root: process.cwd(),
    }),
  ],
});

const html = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.pug',
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
      },
    }),
  ],
});

const devServer = () => ({
  devServer: {
    hot: true,
    inline: true,
    stats: 'errors-only',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({ multiStep: true }),
  ],
});

const babel = () => ({
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [PATHS.app, PATHS.spec, PATHS.test],
      },
    ],
  },
});

const pug = () => ({
  module: {
    loaders: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        include: PATHS.app,
      },
    ],
  },
});

const less = () => ({
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!less',
        include: PATHS.app,
      },
    ],
  },
});

const css = () => ({
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css',
      },
    ],
  },
});

const json = () => ({
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
});

const png = () => ({
  module: {
    loaders: [
      {
        test: /\.png$/,
        loader: 'url',
      },
    ],
  },
});

const fonts = () => ({
  module: {
    loaders: [
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url',
        include: path.join(PATHS.app, 'assets'),
      },
    ],
  },
});

const provide = () => ({
  plugins: [
    new webpack.ProvidePlugin({
      app: `exports?exports.default!${path.join(PATHS.app, 'app')}`,
    }),
  ],
});

const bundleAnalyzer = () => ({
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
    }),
  ],
});

let config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common, clean(path.join(PATHS.build, '*')), html(), provide(), babel(), pug(), less(), css(), json(), png(), fonts(), bundleAnalyzer());
    break;
  default:
    config = merge(common, devServer(), { devtool: 'eval-source-map' }, html(), provide(), babel(), pug(), less(), css(), json(), png(), fonts());
    break;
}

// export default validate(config)
module.exports = validate(config);
