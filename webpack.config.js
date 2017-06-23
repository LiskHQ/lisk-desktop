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
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'url-loader',
          include: path.join(path.join(__dirname, 'src'), 'assets'),
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !env.prod,
                modules: !env.prod,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !env.prod,
                sourceComments: !env.prod,
                /* eslint-disable global-require */
                plugins: [require('postcss-cssnext')()],
                /* eslint-enable */
              },
            },
          ],
        },
        {
          test: /\.json$/,
          use: ['json-loader'],
        },
      ],
    },
  };
};
