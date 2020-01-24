const webpack = require('webpack');

module.exports = {
	entry: './core/scripts/app.js',
	devtool: 'eval',
	output: {
		filename: 'app.js',
		publicPath: 'http://localhost:8090/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
            "React": "react",
            "ReactDOM": "react-dom"
        })
	],
	devServer: {
		hot: false,
		inline: true,
		https: false,
		port: 8090,
		noInfo: false,
        stats: 'minimal'
	}
}