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
				use: ['react-hot-loader', 'babel-loader?presets[]=es2015&presets[]=react&plugins[]=transform-object-rest-spread']
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
            "React": "react",
            "ReactDOM": "react-dom",
            "Datetime": "react-datetime"
        })
	],
	devServer: {
		hot: true,
		inline: true,
		https: false,
		port: 8090,
		noInfo: false,
        stats: 'minimal'
	}
}