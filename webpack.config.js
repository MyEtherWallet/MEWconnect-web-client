const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  'mode': 'development',
  'entry': './src/index.js',
  'output': {
    path: path.resolve(__dirname, 'dist'),
    'filename': 'index.js',
    // library: 'someLibName',
    // libraryTarget: 'umd',
    libraryTarget: 'umd',
    globalObject: 'this',
    // libraryExport: 'default',
    library: 'MEWconnect'
  },
  'module': {
    'rules': [
      {
        'test': /\.js$/,
        'exclude': /node_modules/,
        // 'use': {
        //   'loader': 'babel-loader',
        //   'options': {
        //     'presets': [
        //       'env'
        //     ]
        //   }
        // }
      },
      {
        'test': /\.css$/,
        'use': [
          'style-loader',
          'css-loader'
        ]
      },
      {
        'test': /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  externals: [

  ],
  optimization: {
    runtimeChunk: true
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendors',
    //       chunks: 'initial'
    //     }
    //   }
    // }
  }
};