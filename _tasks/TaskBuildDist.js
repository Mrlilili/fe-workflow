/**
 * Created by heyAaron on 2016/6/13.
 * OutputTask
 */

var path = require('path');
var fs = require('fs');


function OutputTask(gulp, plugins, conf) {

    var outputPath = conf.distOutputPath;
    var cssPath = outputPath + '/css/';
    var jsPath = outputPath + '/js/';
    var imgPath = outputPath + '/imgs/';

    var jade2htmlTask = function (source, outputPath) {
        var config = {
            pretty: false
        };
        if (!!arguments[0]) {
            config.data = {jsPath: outputPath}
        }

        gulp.src('public/tpl/pages/' + source + '.jade')
            .pipe(plugins.jade(config))
            .pipe(gulp.dest(conf.distOutputPath))
    }

    gulp.task('moveCssFile', function () {
        return gulp.src('./public/sass/*')
            .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
            .pipe(gulp.dest(cssPath));
    })
    gulp.task('moveImgs', function () {

        return gulp.src('./public/imgs/*/*')
            .pipe(gulp.dest(imgPath));

    })

    gulp.task('tinyimg', function () {
        return gulp.src(['public/imgs/**/*.png', 'public/imgs/**/*.jpg'])
            .pipe(plugins.tinyimg(conf.tinyImgKey))
            .pipe(gulp.dest(imgPath));
    });

    gulp.task('sprite', ['moveCssFile', 'moveImgs'], function () {
        return gulp.src(cssPath + '*.css')
            .pipe(plugins.cssSpritesmith({
                imagepath: imgPath+'slice/',
                spritedest: imgPath+'sprite/',
                spritepath: '../imgs/sprite/'
            }))
            .pipe(gulp.dest('./'));
    })


    gulp.task('minifyCss', ['sprite'], function () {
        return gulp.src('output/css/*.css')
            .pipe(plugins.cleanCss({compatibility: 'ie8'}))
            .pipe(gulp.dest(cssPath))
    });

    gulp.task('webpackJadeTask', function () {
        var pageJsPath = './public/js/page/';//页面js根目录
        fs.readdir(pageJsPath, function (err, data) {
            var srcPath = data;
            for (var i = 0; i < srcPath.length; i++) {
                (function (i) {
                    var sourcePath = path.join(pageJsPath, srcPath[i] + '/index.js');//打包前的目录
                    var outputPath = path.join(jsPath, srcPath[i]);//打包后的目录
                    fs.exists(sourcePath, function (res) {
                        if (res == true) {
                            gulp.src(sourcePath)
                                .pipe(plugins.webpack(require('./webpack.config.js')(srcPath[i])))
                                .pipe(plugins.uglify())
                                .pipe(gulp.dest(outputPath));
                            jade2htmlTask(srcPath[i], './js/' + srcPath[i] + '/index.js')
                        }
                    })
                })(i)
            }
        });
    });


    gulp.task('build', ['minifyCss', 'webpackJadeTask']);

}


module.exports = OutputTask;