module.exports = {
  devServer: {
    https: true,
    hotOnly: false
  },
  publicPath:
    process.env.NODE_ENV === 'production' ? '/MEWconnect-web-client/' : './'
};
