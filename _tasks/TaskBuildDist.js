/**
 * Created by heyAaron on 2016/6/13.
 * OutputTask
 */

var path = require('path');
var fs = require('fs');
var conf = require('../config');
function OutputTask(gulp, plugins) {
    gulp.task('moveCssFile', function () {
        return gulp.src('./public/css/*')
            .pipe(gulp.dest('./output/css/'));
    })
    gulp.task('moveImgsFile', function () {
        gulp.src('./public/imgs/*/*')
            .pipe(gulp.dest('./output/imgs/'));

    })



    gulp.task('buildt',function(){

            var pagePath = path.join(conf.jspath, 'page');
            fs.readdir(pagePath, function (err, data) {
                var srcPath = data;
                for (var i = 0; i < srcPath.length; i++) {
                    (function (i) {
                        console.log(srcPath[i]);
                        fs.exists(path.join(pagePath, srcPath[i] + '/src/index.js'), function (res) {
                            if (res == true) {
                                var sourcePath = path.join(pagePath, srcPath[i] + '/src/index.js');//打包前的目录
                                var outputPath = path.join('./output/js',srcPath[i]);//打包后的目录
                                gulp.src(sourcePath)
                                    .pipe(plugins.webpack(require('./webpack.config.js')(srcPath[i])))
                                    .pipe(gulp.dest(outputPath));
                                //jade2htmlTask(srcPath[i], './js/page/' + srcPath[i] + '/dist/index.js')
                            }
                        })
                    })(i)
                }
            });

    })


    gulp.task('build', ['moveCssFile', 'moveImgsFile'], function () {
        gulp.src('./output/css/*.css')
            .pipe(plugins.cssSpritesmith({
                imagepath: './output/imgs/slice/',
                spritedest: './output/imgs/sprite/',
                spritepath: '../imgs/sprite/'
            }))
            .pipe(gulp.dest('./'));
    });

}


module.exports = OutputTask;