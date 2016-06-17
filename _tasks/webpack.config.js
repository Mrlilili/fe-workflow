var path = require('path');


console.log(path.resolve('../' , __dirname));
console.log(path.resolve('../' , __dirname, 'public'));

module.exports = function (outputPath, type) {
    return {
        output: {
            publicPath: type == 'dev' ? 'js/page/' + outputPath + '/dist/' : 'js/' + outputPath + '/',
            filename: 'index.js',
        },
        module: {
            loaders: [
                {test: /\.css$/, loader: "style-loader!css-loader"},
                {test: /\.png$/, loader: "url-loader?limit=100000"},
                {test: /\.jpg$/, loader: "file-loader"}
            ]
        },
        resolve: {
            root: ['./public/css/','./public/'],
            alias: {
                'jquery': 'lib/jquery/jquery'
            }
        },
    }
}