const path = require('path')

module.exports = {
  mode: 'none', // "production" | "development" | "none"
  entry: {
    MewConnect: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // string
    filename: '[name].min.js',
    library: 'MewConnect', // string,
    // the name of the exported library
    // TODO figure out the best option to use here
    libraryTarget: 'umd', // umd', // "var" | "assign" | "this" | "window" | "global" | "commonjs" | "commonjs2" | "amd" | "umd"
    // the type of the exported library
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
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
  target: 'web' // enum
  // the environment in which the bundle should run
}
