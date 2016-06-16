/**
 * Created by heyAaron on 2016/6/13.
 * DevTask
 */
var path = require('path');
var fs = require('fs');
function DevTask(gulp, plugins, conf) {
    //Sass编译
    gulp.task('sass', function () {
        gulp.watch('public/sass/*.scss').on('change', function () {
            gulp.src('public/sass/*.scss')
                .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
                .pipe(gulp.dest('public/css/'));
        })
    });
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
                                .pipe(plugins.webpack(require('./webpack.config.js')(srcPath[i],'dev')))
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
    //devTask
    gulp.task('dev', ['sass', 'webpack', 'jade2html', 'connect', 'serve'], function () {
        var server = plugins.livereload();
        gulp.watch(['public/*.html', 'public/css/*.css', 'public/js/*.js'])
            .on('change', function (file) {
                server.changed(file.path);
            })
    });
}


module.exports = DevTask;