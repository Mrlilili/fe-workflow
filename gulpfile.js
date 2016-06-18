'use strict';
var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
var conf = require('./config');

//prefix css
gulp.task('prefix', function () {
    gulp.src('public/css/*.css')
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest('public/css/'));
});

//图片压缩 https://tinypng.com/developers
gulp.task('tinyimg', function () {
    return gulp.src(['public/imgs/**/*.png', 'public/imgs/**/*.jpg'])
        .pipe(plugins.tinyimg(conf.tinyImgKey))
        .pipe(gulp.dest('./output/imgs/'));
});

gulp.task('tmod', function(){
    var stream = gulp.src('public/tpl/tmod/*.tpl')
        .pipe(plugins.tmod({
            'output':'./build',

        }))
        .pipe(gulp.dest('test/build/default'));

    return stream;
});

//require('./_tasks/TaskBuildDist')(gulp,plugins,conf)
require('./_tasks/TaskBuildDev')(gulp,plugins,conf)