const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'none', // "production" | "development" | "none"
  entry: {
    MewConnectBrowserTest: [/*'babel-polyfil', */'../specs/MewConnectInitiator.spec.js']
  },
  output: {
    path: __dirname, // string
    filename: '[name].min.js',
    // library: 'MewConnect', // string,
    // the name of the exported library
    // TODO figure out the best option to use here
    // libraryTarget: 'umd', // umd', // "var" | "assign" | "this" | "window" | "global" | "commonjs" | "commonjs2" | "amd" | "umd"
    // the type of the exported library
    // globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [require('babel-plugin-transform-object-rest-spread')],
            presets: ["env"]
          }
        }
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  performance: {
    hints: 'warning', // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000 // int (in bytes)
  },
  devtool: 'source-map', // enum
  context: __dirname, // string (absolute path!)
  target: 'web', // enum
  // the environment in which the bundle should run
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
  ]
}
