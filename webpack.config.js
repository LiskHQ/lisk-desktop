const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

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
      path: path.resolve(__dirname, 'dist'),
      filename: env.test ? 'bundle.js' : 'bundle.[name].js',
    },
    devServer: {
      contentBase: 'src',
      inline: true,
      port: 8080,
      historyApiFallback: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: env.prod,
      }),
      env.prod
        ? new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          mangle: false,
        })
        : undefined,
      env.analyze ? new BundleAnalyzerPlugin() : undefined,
      env.test
        ? undefined
        : new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
        }),
    ].filter(p => !!p),
    externals: env.test ? external : {},
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
            plugins: ['syntax-trailing-function-commas'],
            env: {
              test: {
                plugins: ['istanbul'],
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.json$/,
          use: ['json-loader'],
        },
      ],
    },
  };
};
