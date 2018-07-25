var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['mocha',],
        browsers: ['Chrome',],

        preprocessors: {
            // add webpack as preprocessor
            'src/**/*.js': ['webpack', 'coverage'],
            'tests/*_test.js': [ 'webpack' ],
            'tests/**/*_test.js': [ 'webpack' ]
        },

        files: [
            // all files ending in "_test"
            'src/**/*.js',
            { pattern: 'tests/*_test.js', watched: false },
            { pattern: 'tests/**/*_test.js', watched: false }
            // each file acts as entry point for the webpack configuration
        ],

        plugins: [
            'karma-chrome-launcher', 'karma-chai', 'karma-mocha',
            'karma-sourcemap-loader', 'karma-webpack', 'karma-coverage',
            'karma-mocha-reporter'
        ],

        webpack: webpackConfig,

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            reporters : [
                {
                    type : 'html',
                    dir : '.fecoverage/'
                },
                {
                    type: 'json',
                    dir: '.fecoverage/'
                }
            ]
        },

        watch: true,
        singleRun: false
    });
};
