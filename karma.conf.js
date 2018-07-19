module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['mocha',],
        browsers: ['Chrome',],

        preprocessors: {
            // add webpack as preprocessor
            'tests/*_test.js': [ 'webpack' ],
            'tests/**/*_test.js': [ 'webpack' ]
        },

        files: [
            // all files ending in "_test"
            { pattern: 'tests/*_test.js', watched: false },
            { pattern: 'tests/**/*_test.js', watched: false }
            // each file acts as entry point for the webpack configuration
        ],

        plugins: [
            'karma-chrome-launcher', 'karma-chai', 'karma-mocha',
            'karma-sourcemap-loader', 'karma-webpack', 'karma-coverage',
            'karma-mocha-reporter'
        ],

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

        watch: false,
        singleRun: true
    });
};
