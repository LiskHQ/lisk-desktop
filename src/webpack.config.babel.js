
import path from 'path'

import webpack from 'webpack'
import merge from 'webpack-merge'
import validate from 'webpack-validator'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

import pkg from './package'

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.resolve(__dirname, '..', 'app')
}

const common = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: `app.js`,
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery'
    }
  },
}

let clean = (path) => {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  }
}

let html = () => {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'app/index.jade',
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
        }
      })
    ]
  }
}

let minify = () => {
  return {
    plugins: [
      new ngAnnotatePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        }
      })
    ]
  }
}

let devServer = () => {
  return {
    devServer: {
      hot: true,
      inline: true,
      stats: 'errors-only',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({ multiStep: true })
    ]
  }
}

let babel = () => {
  return {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          include: PATHS.app,
        }
      ]
    }
  }
}

let jade = () => {
  return {
    module: {
      loaders: [
        {
          test: /\.jade$/,
          loader: 'jade',
          include: PATHS.app,
        }
      ]
    }
  }
}

let less = () => {
  return {
    module: {
      loaders: [
        {
          test: /\.less$/,
          loader: 'style!css!less',
          include: PATHS.app,
        }
      ]
    }
  }
}

let css = () => {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: 'style!css',
        }
      ]
    }
  }
}

let json = () => {
  return {
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json',
        }
      ]
    }
  }
}

let png = () => {
  return {
    module: {
      loaders: [
        {
          test: /\.png$/,
          loader: 'url',
        }
      ]
    }
  }
}

let fonts = () => {
  return {
    module: {
      loaders: [
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'url',
          include: path.join(PATHS.app, 'assets')
        }
      ]
    }
  }
}

let provide = () => {
  return {
    plugins: [
      new webpack.ProvidePlugin({
        app: 'exports?exports.default!' + path.join(PATHS.app, 'app'),
      }),
    ]
  }
}

let config

switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,

      clean(path.join(PATHS.build, '*')),
      minify(),

      html(),
      provide(),
      babel(),
      jade(),
      less(),
      css(),
      json(),
      png(),
      fonts()
    )
    break
  default:
    config = merge(
      common,

      devServer(),
      { devtool: 'eval-source-map' },

      html(),
      provide(),
      babel(),
      jade(),
      less(),
      css(),
      json(),
      png(),
      fonts()
    )
    break
}

export default validate(config)
