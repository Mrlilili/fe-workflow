'use strict';
var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
var conf = require('./config');
//压缩HTML
gulp.task('minify-html', function () {
    gulp.src('public/*.html')
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('output/'));
});
//Sass编译
gulp.task('sass', function () {
    gulp.src('public/sass/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest('public/css/'));
});
//prefix css
gulp.task('prefix', function () {
    gulp.src('public/css/*.css')
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest('public/css/'));
});
//css文件压缩
gulp.task('minify-css', function () {
    gulp.src('public/css/*.css')
        .pipe(plugins.cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public/css/'));
});
//CSS文件合并
gulp.task('concat-css', function () {
    gulp.src('public/css/*.css')
        .pipe(plugins.concat('all.css'))
        .pipe(gulp.dest('./output/css/'))
});
//JS文件合并
gulp.task('concat-js', function () {
    gulp.src('public/js/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('./output/js/'))
});
//拼接雪碧图
gulp.task('sprites', function () {
    gulp.src('public/css/*.css')
        .pipe(plugins.cssSpritesmith({
            imagepath: './public/imgs/slice/',
            spritedest: './public/imgs/sprite/'
        }))
        .pipe(gulp.dest('./'));
})
//js压缩
gulp.task('minify-js', function () {
    gulp.src('public/js/*.js')
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./'));
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
    var opn = require('opn');
    opn('http://localhost:' + conf.port);
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = plugins.livereload();
    gulp.watch(['public/*.html', 'public/css/*.css', 'public/js/*.js'])
        .on('change', function (file) {
            server.changed(file.path);
        })
});

gulp.task('test', function () {
    console.log(conf);
})