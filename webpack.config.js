module.exports = function (outputPath) {
    return {
        output: {
            publicPath: 'js/page/' + outputPath + '/dist/',
            filename: 'index.js',
        },
        resolve: {
            root: './public/',
            alias:{
                'jquery':'lib/jquery/jquery'
            }
        },
    }
}