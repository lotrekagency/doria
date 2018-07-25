const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules|test/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    query: {
                    esModules: true
                    },
                },

            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {loader: 'html-loader'}
            }
        ]
    }
};
