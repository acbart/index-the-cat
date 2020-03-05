const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const JavaScriptObfuscator = require('webpack-obfuscator');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const RECOMMENDED_MAXIMUM_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const EGDD_FILE = "egdd.md";

module.exports = (env) => {
    let endpoint = env.endpoint;

    // Copy EGDD to appropriate endpoint
    fs.copyFileSync(path.resolve(__dirname, '../', EGDD_FILE),
        path.resolve(__dirname, `../dist/${endpoint}/${EGDD_FILE}`),
        (err) => {
            if (err) throw err;
            console.log('source.txt was copied to destination.txt');
        });

    // Get game name from Manifest
    let gameUrl = process.env.npm_package_name;
    //let gameName = "Index the Cat";

    // Update the index file for the dist directory
    // Directory
    // * Game, EGDD

    // Build the actual folder of contents
    let ghpages = {
        mode: 'production',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        filename: 'gen.[name].[contenthash].bundle.js'
                    }
                }
            }
        },
        performance: {
            maxEntrypointSize: RECOMMENDED_MAXIMUM_FILE_SIZE,
            maxAssetSize: RECOMMENDED_MAXIMUM_FILE_SIZE
        },
        output: {
            path: path.resolve(__dirname, `../dist/${endpoint}`),
            publicPath: `/${gameUrl}/${endpoint}`,
            filename: 'gen.[name].[contenthash].bundle.js',
            chunkFilename: 'gen.[name].[contenthash].chunk.js'
        },
        plugins: [
            new CleanWebpackPlugin([`dist/${endpoint}/*.js`], {
                root: path.resolve(__dirname, '../')
            }),
            new JavaScriptObfuscator(
                {
                    rotateStringArray: true,
                    stringArray: true,
                    // stringArrayEncoding: 'base64', // disabled by default
                    stringArrayThreshold: 0.75
                },
                ['vendors.*.js']
            )
        ]
    };
    return merge(common, ghpages);
};
