module.exports = function (outputPath) {
    console.log(outputPath);
    return {
        output: {
            publicPath: 'js/page/' + outputPath + '/dist/',
            filename: '[name].js',
        },
    }
}