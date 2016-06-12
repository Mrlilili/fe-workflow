'use strict';
var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
var conf = require('./config');
var fs = require('fs');
var path = require('path');
var outputJsPath = null;
//压缩HTML
gulp.task('minify-html', function () {
    gulp.src('public/*.html')
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('output/'));
});
//Sass编译
gulp.task('sass', function () {
    gulp.watch('public/sass/*.scss').on('change', function () {
        gulp.src('public/sass/*.scss')
            .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
            .pipe(gulp.dest('public/css/'));
    })
});
//prefix css
gulp.task('prefix', function () {
    gulp.src('public/css/*.css')
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest('public/css/'));
});
//CSS文件压缩
//gulp.task('minify-css', function () {
//    gulp.src('output/css/*.css')
//        .pipe(plugins.cleanCss({compatibility: 'ie8'}))
//        .pipe(gulp.dest('./output/css/'));
//});

//CSS文件合并压缩
gulp.task('concatCss', function () {
    gulp.src('public/css/*.css')
        //.pipe(plugins.concat('all.css'))
        .pipe(plugins.cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./output/css/'))
});
//JS压缩
gulp.task('minifyJs', function () {
    gulp.src('public/js/*.js')
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./output/js/'));
});
//JS文件合并
gulp.task('concatJs', function () {
    gulp.src('public/js/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('./output/js/'))
});


//图片压缩 https://tinypng.com/developers
gulp.task('tinyimg', function () {
    return gulp.src(['public/imgs/**/*.png', 'public/imgs/**/*.jpg'])
        .pipe(plugins.tinyimg(conf.tinyImgKey))
        .pipe(gulp.dest('./output/imgs/'));
});
//拼接雪碧图
gulp.task('sprites', function () {
    console.log(4);
    gulp.src('./public/css/*.css')
        .pipe(plugins.cssSpritesmith({
            imagepath: './public/imgs/slice/',
            spritedest: './public/imgs/sprite/',
            spritepath: '../imgs/sprite/'
        }))
        .pipe(gulp.dest('./'));
    console.log(5);
});


//jade模板处理
var jade2htmlTask = function (source, outputPath) {
    var config = {
        pretty: true
    };
    if (!!arguments[0]) {
        config.data = {jsPath: outputPath}
    }
    gulp.src('public/tpl/pages/' + source + '.jade')
        .pipe(plugins.jade(config))
        .pipe(gulp.dest('./public/'))
}
gulp.task('jade2html', function () {
    gulp.watch('public/tpl/**/*.jade')
        .on('change', function () {
            webpackTask()
        })
})


//webpack打包
function webpackTask() {
    var pagePath = path.join(conf.jspath, 'page');
    fs.readdir(pagePath, function (err, data) {
        var srcPath = data;
        for (var i = 0; i < srcPath.length; i++) {
            (function (i) {
                fs.exists(path.join(pagePath, srcPath[i] + '/src/index.js'), function (res) {
                    if (res == true) {
                        var sourcePath = path.join(pagePath, srcPath[i] + '/src/index.js');//打包前的目录
                        var outputPath = path.join(pagePath, srcPath[i] + '/dist/');//打包后的目录
                        gulp.src(sourcePath)
                            .pipe(plugins.webpack(require('./webpack.config.js')(srcPath[i])))
                            .pipe(gulp.dest(outputPath));
                        jade2htmlTask(srcPath[i], './js/page/' + srcPath[i] + '/dist/index.js')
                    }
                })
            })(i)
        }
    });
}
gulp.task('webpack', function () {
    gulp.watch('public/js/page/*/src/*.js').on('change', webpackTask)
});


//创建server服务
gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({port: 35729}))
        .use(connect.static('public'))
        .use(connect.directory('public'));

    require('http').createServer(app)
        .listen(conf.port)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:' + conf.port);
        });
});


//在浏览器中打开
gulp.task('serve', ['connect'], function () {
    if (conf.autoOpenBrowser) {
        var opn = require('opn');
        opn('http://localhost:' + conf.port);
    }

});

gulp.task('watch', ['sass', 'webpack', 'jade2html', 'connect', 'serve'], function () {
    var server = plugins.livereload();
    gulp.watch(['public/*.html', 'public/css/*.css', 'public/js/*.js'])
        .on('change', function (file) {
            server.changed(file.path);
        })
});

gulp.task('moveFile',function(){
    console.log(1);
    gulp.src('./public/css/*')
        .pipe(gulp.dest('./output/css/'));
    console.log(2);
    gulp.src('./public/imgs/*/*')
        .pipe(gulp.dest('./output/imgs/'));
    console.log(3);

})

gulp.task('build',['sprites','moveFile'],function(){

});
