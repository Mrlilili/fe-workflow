module.exports = function (outputPath,type) {
    return {
        output: {
            publicPath: type == 'dev'?'js/page/' + outputPath + '/dist/':'js/' + outputPath + '/',
            filename: 'index.js',
        },
        module: {
            loaders:[

                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader?modules'
                }
            ]
        },
        resolve: {
            root: './public/',
            alias:{
                'jquery':'lib/jquery/jquery'
            }
        },
    }
}