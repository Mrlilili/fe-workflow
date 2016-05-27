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
        .pipe(plugins.concat('all.css'))
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
gulp.task('concat-js', function () {
    gulp.src('public/js/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('./output/js/'))
});

//拼接雪碧图
gulp.task('sprites', function () {
    gulp.src('output/css/*.css')
        .pipe(plugins.cssSpritesmith({
            imagepath: './output/imgs/slice/',
            spritedest: './output/imgs/sprite/',
            spritepath: '../imgs/sprite/'
        }))
        .pipe(gulp.dest('./'));
});


//jade模板处理
gulp.task('jade2html', function () {
    gulp.watch('public/tpl/**/*.jade').on('change', function () {
        gulp.src('public/tpl/pages/*.jade')
            .pipe(plugins.jade({
                pretty: true,
                data:{
                    'testdata':'this is test data'
                }
            }))
            .pipe(gulp.dest('./public/'))
    })
})

//webpack打包
gulp.task('webpack', function () {
    return gulp.src('./public/js/page/webpack/src/index.js')
        .pipe(plugins.webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./public/js/page/webpack/dist/'));
});
//创建目录
gulp.task('cf',function(){
    gulp.dest('./testf/');
})

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

gulp.task('watch', ['sass', 'jade2html', 'connect', 'serve'], function () {
    var server = plugins.livereload();
    gulp.watch(['public/*.html', 'public/css/*.css', 'public/js/*.js'])
        .on('change', function (file) {
            server.changed(file.path);
            console.log('资源已更新');
        })
});

gulp.task('build', ['minify-html', 'concatCss', 'minifyJs'], function () {
    gulp.src('public/imgs/**/*')
        .pipe(gulp.dest('output/imgs/'))
});