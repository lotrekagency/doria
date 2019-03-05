const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const SizePlugin = require("size-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const normalConfig = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'doria.js',
        library: 'doria',
        libraryTarget: 'umd'
    },
    stats: {
        // fallback value for stats options when an option is not defined (has precedence over local webpack defaults)
        all: undefined,

        // Add asset Information
        assets: false,
        modules: false,
        builtAt: false

    },
    optimization: {
        minimizer: [
          new OptimizeCssAssetsPlugin({})
        ]},
    module: {
        rules: [{
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    "sass-loader"
                ]
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            ["@babel/preset-env", {
                                "useBuiltIns": "usage",
                                "debug": true,
                                "targets": {
                                    "browsers": [
                                        "> 3%",
                                        "safari >= 10",
                                        "ie > 11"
                                    ]
                                }
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: true,
                        collapseWhitespace: true,
                        collapseInlineTagWhitespace: true,
                    }
                }
            }
        ]
    },
    plugins: [
        new TerserPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
          }),
        new SizePlugin(),
        new BundleAnalyzerPlugin(),

    ]
};

const ie11Config = merge({}, normalConfig);

ie11Config.output = {
    path: path.resolve(__dirname, 'lib'),
    filename: 'doria-ie11.js',
    library: 'doria',
    libraryTarget: 'umd'
};
ie11Config.module.rules[1] = {
    test: /\.js$/,
    include: [
        path.resolve(__dirname, "src")
    ],
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: 'babel-loader',
        options: {
            "presets": [
                ["@babel/preset-env", {
                    "useBuiltIns": "usage",
                    "debug": true,
                    "targets": {
                        "browsers": [
                            "> 3%",
                            "safari >= 10",
                            "ie >= 11"
                        ]
                    }
                }]
            ]
        }
    }
},

module.exports = [ normalConfig, ie11Config ];
