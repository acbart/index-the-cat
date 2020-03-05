const path = require('path');
const merge = require('webpack-merge');
const prod = require('./webpack.prod');

ghpages = {
  output: {
    path: path.resolve(__dirname, `../dist/${endpoint}`),
    publicPath: `/index-the-cat/${endpoint}`
  }
};

module.exports = merge(prod, ghpages);
