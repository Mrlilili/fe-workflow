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
var jade2htmlFuc = function (source, outputPath) {
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
gulp.task('jade2html', jade2htmlFuc)


//webpack打包
gulp.task('webpack', function () {

    gulp.watch('public/js/page/*/src/*.js').on('change', function () {
        var pagePath = path.join(conf.jspath, 'page');
        fs.readdir(pagePath, function (err, data) {
            var srcPath = data;
            for (var i = 0; i < srcPath.length; i++) {
                (function (i) {
                    fs.exists(path.join(pagePath, srcPath[i] + '/src/index.js'), function (res) {
                        //console.log(res, i);
                        if (res == true) {
                            var sourcePath = path.join(pagePath, srcPath[i] + '/src/index.js');
                            var outputPath = path.join(pagePath, srcPath[i] + '/dist/');
                            gulp.src(sourcePath)
                                .pipe(plugins.webpack(require('./webpack.config.js')(srcPath[i])))
                                .pipe(gulp.dest(outputPath));


                            jade2htmlFuc(srcPath[i], './js/page/' + srcPath[i] + '/dist/index.js')


                            //if(outputJsPath !== 'js/page/' + outputPath + '/dist/'){
                            //    outputJsPath ='js/page/' + outputPath + '/dist/index.js'
                            //    jade2htmlFuc(outputJsPath)
                            //}
                        }
                    })
                })(i)
            }
        });

    })


});


//创建server服务
gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({port: 35729}))
        .use(connect.static('public'))
        .use(connect.directory('public'));
    console.log(conf.port);
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

gulp.task('watch', ['sass', 'connect', 'serve'], function () {
    var server = plugins.livereload();
    gulp.watch('public/tpl/**/*.jade')
        .on('change', function (file) {
            /**
             * 问题描述
             * jade生成的路径问题
             */
            console.log();
            jade2htmlFuc(file.path);
            console.log('12');
        })

    gulp.watch(['public/*.html', 'public/css/*.css', 'public/js/*.js'])
        .on('change', function (file) {
            server.changed(file.path);

        })
});

gulp.task('build', ['minify-html', 'concatCss', 'minifyJs'], function () {
    gulp.src('public/imgs/**/*')
        .pipe(gulp.dest('output/imgs/'))
});
