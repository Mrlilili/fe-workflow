var config;
try {
  config = require('./config.json');
} catch (err) {
  config = {};
}
var MODULE_PATH = config.nodePath || __dirname;
// var webpack = require("webpack");
var path = require('path');
var glob = require(path.join(MODULE_PATH, 'glob'));
var jsPath = './public/assets/js/';

var entries = {};
console.log('g:',path.join(jsPath, 'dist'));
glob.sync('./public/assets/js/page/**/*.js').forEach(function (filePath) {
  var prop = path.basename(filePath, '.js');
  entries[prop] = filePath;
});


module.exports = {
  entry: entries,
  output: {
    path: path.join(jsPath, 'dist'),
    publicPath: path.join(jsPath, 'dist'),
    filename: "[name].js"
    // chunkFilename: "[chunkhash].js"
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   // Automtically detect jQuery and $ as free var in modules
    //   // and inject the jquery library
    //   // This is required by many jquery plugins
    //   jQuery: "jquery",
    //   $: "jquery"
    // })
  ],
  externals: {
    'jquery': "jQuery"
  }
};