module.exports = function (outputPath,type) {
    return {
        output: {
            publicPath: type == 'dev'?'js/page/' + outputPath + '/dist/':'js/' + outputPath + '/',
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