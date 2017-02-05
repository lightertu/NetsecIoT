/**
 * Created by rui on 2/4/17.
 */
let debug = process.env.NODE_ENV !== "production";
let webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        "./public/app/src/index.js",
    ],
    output: {
        path: __dirname + "public/dist",
        filename: "bundle.js",
        publicPath: "/"
    },
    plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-2'],
                    plugins: ['react-html-attrs', 'transform-class-properties']
                }
            }
        ]
    }
};

