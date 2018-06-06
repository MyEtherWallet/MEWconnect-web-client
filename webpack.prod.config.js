const path = require('path');

module.exports = {
  mode: "development", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: {
    MewConnect: "./src/index.js",
    // MewConnectReceiver: "./src/MewConnectReceiverClient.js",
  }, // ["babel-polyfill", "./src/index.js"] , // string | object | array
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name].min.js",
    // the filename template for entry chunks
    // publicPath: "/assets/", // string
    // the url to the output directory resolved relative to the HTML page
    library: "MewConnect", // string,
    // the name of the exported library
    libraryTarget: "umd", // TODO figure out the best option to use here
    // the type of the exported library
    /* Advanced output configuration (click to show) */
  },
  externals: {
    eccrypto: 'eccrypto'
  },
  module: {
    // configuration regarding modules
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".css"],
    // extensions that are used
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
  },
  recordsPath: path.join(__dirname, 'records.json'),
  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  target: "node", // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules
  plugins: [
    // ...
  ],
  // list of additional plugins
}