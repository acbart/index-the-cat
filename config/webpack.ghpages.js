const path = require('path');
const merge = require('webpack-merge');
const prod = require('./webpack.prod');

ghpages = {
  output: {
    publicPath: '/index-the-cat/'
  }
};

module.exports = merge(prod, ghpages);
