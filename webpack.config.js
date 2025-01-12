const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', 
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'), 
    
  },
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    watchFiles: ['src/**/*.html'], 
    port: 8080, 
    open: true, 
    hot: true, 
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // 
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', 
      filename: 'index.html', 
    }),
  ],
};
