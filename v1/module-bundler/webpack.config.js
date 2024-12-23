const { stat } = require('fs');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
  entry : './src/index.js',
  mode : 'development',
  output : {
    filename: 'webpackBundler.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new BundleAnalyzerPlugin({
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false,
      statsOptions: null,
      logLevel: 'info'
    })
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      
    },
    compress: true,
    port: 9000,

  }
}