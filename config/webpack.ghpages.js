const path = require('path');
const merge = require('webpack-merge');
const prod = require('./webpack.prod');

ghpages = {
  output: {
    publicPath: '/phaser-test-game/'
  }
};

module.exports = merge(prod, ghpages);
