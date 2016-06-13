'use strict';
var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
var conf = require('./config');
//var buildDistTask = require('./_tasks/TaskBuildDist')(plugins);
var outputJsPath = null;
//压缩HTML
gulp.task('minify-html', function () {
    gulp.src('public/*.html')
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('output/'));
});

//prefix css
gulp.task('prefix', function () {
    gulp.src('public/css/*.css')
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest('public/css/'));
});
//CSS文件压缩
gulp.task('minify-css', function () {
    gulp.src('output/css/*.css')
        .pipe(plugins.cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./output/css/'));
});
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
    gulp.src('./output/css/*.css')
        .pipe(plugins.cssSpritesmith({
            imagepath: './output/imgs/slice/',
            spritedest: './output/imgs/sprite/',
            spritepath: '../imgs/sprite/'
        }))
        .pipe(gulp.dest('./'));
    console.log(5);
});



require('./_tasks/TaskBuildDist')(gulp,plugins)
require('./_tasks/TaskBuildDev')(gulp,plugins,conf)